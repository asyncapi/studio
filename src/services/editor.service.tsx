import { AbstractService } from './abstract.service';

import { DiagnosticSeverity } from '@asyncapi/parser/cjs';
import { Range, MarkerSeverity } from 'monaco-editor/esm/vs/editor/editor.api';
import toast from 'react-hot-toast';
import fileDownload from 'js-file-download';

import state from '../state';

import type * as monacoAPI from 'monaco-editor/esm/vs/editor/editor.api';
import type { Diagnostic } from '@asyncapi/parser/cjs';
import type { ConvertVersion } from '@asyncapi/converter';

export type AllowedLanguages = 'json' | 'yaml' | 'yml';

export interface UpdateState {
  content: string,
  updateModel?: boolean,
  sendToServer?: boolean,
  language?: AllowedLanguages,
} 

export class EditorService extends AbstractService {
  getInstance(): monacoAPI.editor.IStandaloneCodeEditor {
    return window.Editor;
  }

  getValue() {
    return this.getInstance()
      ?.getModel()?.getValue() as string;
  }

  updateState({
    content,
    updateModel = false,
    sendToServer = true,
    language,
  }: UpdateState) {
    if (state.editor.editorValue.get() === content) {
      return;
    }

    if (!content && typeof content !== 'string') {
      return;
    }

    language = language || this.svcs.formatSvc.retrieveLangauge(content);
    if (!language) {
      return;
    }

    let languageToSave: string;
    switch (language) {
    case 'yaml':
    case 'yml': {
      languageToSave = 'yaml';
      break;
    }
    default: {
      languageToSave = 'json';
    }
    }

    if (sendToServer) {
      this.svcs.socketClientSvc.send('file:update', { code: content });
    }

    if (updateModel) {
      const instance = this.getInstance();
      if (instance) {
        const model = instance.getModel();
        model && model.setValue(content);
      }
    }

    state.editor.merge({
      language: languageToSave,
      editorValue: content,
      modified: this.getFromLocalStorage() !== content,
    });
  }

  async convertSpec(version?: string) {
    const converted = await this.svcs.specificationSvc.convertSpec(
      this.getValue(),
      (version || this.svcs.specificationSvc.getLastVersion()) as ConvertVersion,
    );
    this.updateState({ content: converted, updateModel: true });
  }

  async importFromURL(url: string): Promise<void> {
    if (url) {
      return fetch(url)
        .then(res => res.text())
        .then(async text => {
          state.editor.merge({
            documentFrom: 'url',
            documentSource: url,
          });
          this.updateState({ content: text, updateModel: true });
          await this.svcs.specificationSvc.parseSpec(text, { source: url });
        })
        .catch(err => {
          console.error(err);
          throw err;
        });
    }
  }

  async importFile(files: FileList | null) {
    if (files === null || files?.length !== 1) {
      return;
    }
    const file = files.item(0);
    if (!file) {
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = fileLoadedEvent => {
      const content = fileLoadedEvent.target?.result;
      this.updateState({ content: String(content), updateModel: true });
    };
    fileReader.readAsText(file, 'UTF-8');
  }

  async importBase64(content: string) {
    try {
      const decoded = this.svcs.formatSvc.decodeBase64(content);
      state.editor.merge({
        documentFrom: 'base64',
        documentSource: undefined,
      });
      this.updateState({ content: String(decoded), updateModel: true });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async convertToYaml() {
    try {
      const yamlContent = this.svcs.formatSvc.convertToYaml(this.getValue());
      yamlContent && this.updateState({ content: yamlContent, updateModel: true, language: 'yaml' });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async convertToJSON() {
    try {
      const jsonContent = this.svcs.formatSvc.convertToJSON(this.getValue());
      jsonContent && this.updateState({ content: jsonContent, updateModel: true, language: 'json' });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async saveAsYaml() {
    try {
      const yamlContent = this.svcs.formatSvc.convertToYaml(this.getValue());
      yamlContent && this.downloadFile(yamlContent, `${this.fileName}.yaml`);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async saveAsJSON() {
    try {
      const jsonContent = this.svcs.formatSvc.convertToJSON(this.getValue());
      jsonContent && this.downloadFile(jsonContent, `${this.fileName}.json`);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  saveToLocalStorage(editorValue?: string, notify = true) {
    editorValue = editorValue || this.getValue();
    localStorage.setItem('document', editorValue);
    state.editor.merge({
      documentFrom: 'localStorage',
      documentSource: undefined,
      modified: false,
    });

    if (notify) {
      if (state.settings.editor.autoSaving.get()) {
        toast.success(
          <div>
            <span className="block text-bold">
              Studio is currently saving your work automatically 💪
            </span>
          </div>,
        );
      } else {
        toast.success(
          <div>
            <span className="block text-bold">
              Document succesfully saved to the local storage!
            </span>
          </div>,
        );
      }
    }
  }

  getFromLocalStorage() {
    return localStorage.getItem('document');
  }

  applyMarkers(diagnostics: Diagnostic[] = []) {
    const editor = this.getInstance();
    const Monaco = window.monaco;
    if (!editor || !Monaco) {
      return;
    }

    const model = editor.getModel();
    if (!model) {
      return;
    }

    diagnostics = this.svcs.specificationSvc.filterDiagnostics(diagnostics);
    const { markers, decorations } = this.createMarkers(diagnostics);
    Monaco.editor.setModelMarkers(model, 'asyncapi', markers);
    let oldDecorations = state.editor.decorations.get();
    if (oldDecorations.length === 0) {
      oldDecorations = [];
    }
    oldDecorations = editor.deltaDecorations(oldDecorations, decorations);
    state.editor.decorations.set(oldDecorations || []);
  }

  createMarkers(diagnostics: Diagnostic[]) {
    diagnostics = diagnostics || [];
    const newDecorations: monacoAPI.editor.IModelDecoration[] = [];
    const newMarkers: monacoAPI.editor.IMarkerData[] = [];

    diagnostics.forEach(diagnostic => {
      const { message, range, severity } = diagnostic;

      if (severity !== DiagnosticSeverity.Error) {
        newDecorations.push({
          id: 'asyncapi',
          ownerId: 0,
          range: new Range(
            range.start.line + 1, 
            range.start.character + 1,
            range.end.line + 1,
            range.end.character + 1
          ),
          options: {
            glyphMarginClassName: this.getSeverityClassName(severity),
            glyphMarginHoverMessage: { value: message },
          },
        });
        return;
      }
  
      newMarkers.push({
        startLineNumber: range.start.line + 1,
        startColumn: range.start.character + 1,
        endLineNumber: range.end.line + 1,
        endColumn: range.end.character + 1,
        severity: this.getSeverity(severity),
        message,
      });
    });

    return { decorations: newDecorations, markers: newMarkers };
  }

  private getSeverity(severity: DiagnosticSeverity): monacoAPI.MarkerSeverity {
    switch (severity) {
    case DiagnosticSeverity.Error: return MarkerSeverity.Error;
    case DiagnosticSeverity.Warning: return MarkerSeverity.Warning;
    case DiagnosticSeverity.Information: return MarkerSeverity.Info;
    case DiagnosticSeverity.Hint: return MarkerSeverity.Hint;
    default: return MarkerSeverity.Error;
    }
  }

  private getSeverityClassName(severity: DiagnosticSeverity): string {
    switch (severity) {
    case DiagnosticSeverity.Warning: return 'diagnostic-warning';
    case DiagnosticSeverity.Information: return 'diagnostic-information';
    case DiagnosticSeverity.Hint: return 'diagnostic-hint';
    default: return 'diagnostic-warning';
    }
  }

  private fileName = 'asyncapi';
  private downloadFile(content: string, fileName: string) {
    return fileDownload(content, fileName);
  }
}
