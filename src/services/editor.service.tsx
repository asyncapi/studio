import { DiagnosticSeverity } from '@asyncapi/parser/cjs';
import { Range, MarkerSeverity } from 'monaco-editor/esm/vs/editor/editor.api';
import toast from 'react-hot-toast';
import fileDownload from 'js-file-download';

import { FormatService } from './format.service';
import { SpecificationService } from './specification.service';
import { SocketClient } from './socket-client.service';

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

export class EditorService {
  static getInstance(): monacoAPI.editor.IStandaloneCodeEditor {
    return window.Editor;
  }

  static getValue() {
    return this.getInstance()
      ?.getModel()?.getValue() as string;
  }

  static updateState({
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

    language = language || FormatService.retrieveLangauge(content);
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
      SocketClient.send('file:update', { code: content });
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

  static async convertSpec(version?: string) {
    const converted = await SpecificationService.convertSpec(
      this.getValue(),
      (version || SpecificationService.getLastVersion()) as ConvertVersion,
    );
    this.updateState({ content: converted, updateModel: true });
  }

  static async importFromURL(url: string): Promise<void> {
    if (url) {
      return fetch(url)
        .then(res => res.text())
        .then(async text => {
          state.editor.merge({
            documentFrom: 'url',
            documentSource: url,
          });
          this.updateState({ content: text, updateModel: true });
          await SpecificationService.parseSpec(text, { source: url });
        })
        .catch(err => {
          console.error(err);
          throw err;
        });
    }
  }

  static async importFile(files: FileList | null) {
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

  static async importBase64(content: string) {
    try {
      const decoded = FormatService.decodeBase64(content);
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

  static async convertToYaml() {
    try {
      const yamlContent = FormatService.convertToYaml(this.getValue());
      yamlContent && this.updateState({ content: yamlContent, updateModel: true, language: 'yaml' });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static async convertToJSON() {
    try {
      const jsonContent = FormatService.convertToJSON(this.getValue());
      jsonContent && this.updateState({ content: jsonContent, updateModel: true, language: 'json' });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static async saveAsYaml() {
    try {
      const yamlContent = FormatService.convertToYaml(this.getValue());
      yamlContent && this.downloadFile(yamlContent, `${this.fileName}.yaml`);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static async saveAsJSON() {
    try {
      const jsonContent = FormatService.convertToJSON(this.getValue());
      jsonContent && this.downloadFile(jsonContent, `${this.fileName}.json`);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static saveToLocalStorage(editorValue?: string, notify = true) {
    editorValue = editorValue || EditorService.getValue();
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

  static getFromLocalStorage() {
    return localStorage.getItem('document');
  }

  static applyMarkers(diagnostics: Diagnostic[] = []) {
    const editor = this.getInstance();
    const Monaco = window.monaco;
    if (!editor || !Monaco) {
      return;
    }

    const model = editor.getModel();
    if (!model) {
      return;
    }

    diagnostics = SpecificationService.filterDiagnostics(diagnostics);
    const { markers, decorations } = this.createMarkers(diagnostics);
    Monaco.editor.setModelMarkers(model, 'asyncapi', markers);
    let oldDecorations = state.editor.decorations.get();
    if (oldDecorations.length === 0) {
      oldDecorations = [];
    }
    oldDecorations = editor.deltaDecorations(oldDecorations, decorations);
    state.editor.decorations.set(oldDecorations || []);
  }

  static createMarkers(diagnostics: Diagnostic[]) {
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

  private static getSeverity(severity: DiagnosticSeverity): monacoAPI.MarkerSeverity {
    switch (severity) {
    case DiagnosticSeverity.Error: return MarkerSeverity.Error;
    case DiagnosticSeverity.Warning: return MarkerSeverity.Warning;
    case DiagnosticSeverity.Information: return MarkerSeverity.Info;
    case DiagnosticSeverity.Hint: return MarkerSeverity.Hint;
    default: return MarkerSeverity.Error;
    }
  }

  private static getSeverityClassName(severity: DiagnosticSeverity): string {
    switch (severity) {
    case DiagnosticSeverity.Warning: return 'diagnostic-warning';
    case DiagnosticSeverity.Information: return 'diagnostic-information';
    case DiagnosticSeverity.Hint: return 'diagnostic-hint';
    default: return 'diagnostic-warning';
    }
  }

  private static fileName = 'asyncapi';
  private static downloadFile(content: string, fileName: string) {
    return fileDownload(content, fileName);
  }
}
