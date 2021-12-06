import * as monacoAPI from 'monaco-editor/esm/vs/editor/editor.api';
import toast from 'react-hot-toast';
import fileDownload from 'js-file-download';

import { FormatService } from './format.service';
import { SpecificationService } from './specification.service';

import state from '../state';
import { SocketClient } from './socket-client.service';

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
      version || SpecificationService.getLastVersion(),
    );
    this.updateState({ content: converted, updateModel: true });
  }

  static async importFromURL(url: string): Promise<void> {
    if (url) {
      return fetch(url)
        .then(res => res.text())
        .then(text => {
          state.editor.documentFrom.set(`URL: ${url}` as any);
          this.updateState({ content: text, updateModel: true });
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
      console.log(content);
      this.updateState({ content: String(content), updateModel: true });
    };
    fileReader.readAsText(file, 'UTF-8');
  }

  static async importBase64(content: string) {
    try {
      const decoded = FormatService.decodeBase64(content);
      state.editor.documentFrom.set('Base64');
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
      modified: false,
    });
    notify && toast.success(
      <div>
        <span className="block text-bold">
          Document succesfully saved to the local storage!
        </span>
      </div>,
    );
  }

  static getFromLocalStorage() {
    return localStorage.getItem('document');
  }

  static applyErrorMarkers(errors: any[] = []) {
    const editor = this.getInstance();
    const Monaco = window.Monaco;

    if (!editor || !Monaco) {
      return;
    }

    const model = editor.getModel();
    if (!model) {
      return;
    }
    
    const oldDecorations = state.editor.decorations.get();
    editor.deltaDecorations(oldDecorations, []);
    Monaco.editor.setModelMarkers(model, 'asyncapi', []);
    if (errors.length === 0) {
      return;
    }

    const { markers, decorations } = this.createErrorMarkers(errors, model, Monaco);
    Monaco.editor.setModelMarkers(model, 'asyncapi', markers);
    editor.deltaDecorations(oldDecorations, decorations);
  }

  static createErrorMarkers(errors: any[], model: monacoAPI.editor.ITextModel, Monaco: typeof monacoAPI) {
    errors = errors || [];
    const newDecorations: monacoAPI.editor.IModelDecoration[] = [];
    const newMarkers: monacoAPI.editor.IMarkerData[] = [];
    errors.forEach(err => {
      const { title, detail } = err;
      let location = err.location;

      if (!location || location.jsonPointer === '/') {
        const fullRange = model.getFullModelRange();
        location = {};
        location.startLine = fullRange.startLineNumber;
        location.startColumn = fullRange.startColumn;
        location.endLine = fullRange.endLineNumber;
        location.endColumn = fullRange.endColumn;
      }
      const { startLine, startColumn, endLine, endColumn } = location;
  
      const detailContent = detail ? `\n\n${detail}` : '';
      newMarkers.push({
        startLineNumber: startLine,
        startColumn,
        endLineNumber: typeof endLine === 'number' ? endLine : startLine,
        endColumn: typeof endColumn === 'number' ? endColumn : startColumn,
        severity: monacoAPI.MarkerSeverity.Error,
        message: `${title}${detailContent}`,
      });
      newDecorations.push({
        id: 'asyncapi',
        ownerId: 0,
        range: new Monaco.Range(
          startLine, 
          startColumn, 
          typeof endLine === 'number' ? endLine : startLine, 
          typeof endColumn === 'number' ? endColumn : startColumn
        ),
        options: { inlineClassName: 'bg-red-500-20' },
      });
    });

    return { decorations: newDecorations, markers: newMarkers };
  }

  private static fileName = 'asyncapi';
  private static downloadFile(content: string, fileName: string) {
    return fileDownload(content, fileName);
  }
}
