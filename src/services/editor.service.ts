import * as monacoAPI from 'monaco-editor/esm/vs/editor/editor.api';
import fileDownload from 'js-file-download';

import { FormatService } from './format.service';
import { SpecificationService } from './specification.service';

import state from '../state';

export type AllowedLanguages = 'json' | 'yaml' | 'yml';

export class EditorService {
  static getInstance(): monacoAPI.editor.IStandaloneCodeEditor {
    return window.Editor;
  }

  static getValue() {
    return this.getInstance()
      .getModel()?.getValue() as string;
  }

  static updateState(
    content: string,
    updateModel = false,
    language?: AllowedLanguages,
  ) {
    if (!content) {
      return;
    }

    language = language || FormatService.retrieveLangauge(content);
    if (!language) {
      return;
    }

    switch (language) {
    case 'yaml':
    case 'yml': {
      state.editor.language.set('yaml');
      break;
    }
    default: {
      state.editor.language.set('json');
    }
    }
    state.editor.editorValue.set(content);

    if (updateModel) {
      const instance = this.getInstance();
      if (instance) {
        const model = instance.getModel();
        model && model.setValue(content);
      }
    }
  }

  static async convertSpec(version?: string) {
    const converted = await SpecificationService.convertSpec(
      this.getValue(),
      version || SpecificationService.getLastVersion(),
    );
    this.updateState(converted, true);
  }

  static async importFromURL(url: string): Promise<void> {
    if (url) {
      return fetch(url)
        .then(res => res.text())
        .then(text => {
          this.updateState(text, true);
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
      this.updateState(String(content), true);
    };
    fileReader.readAsText(file, 'UTF-8');
  }

  static async importBase64(content: string) {
    try {
      const decoded = FormatService.decodeBase64(content);
      this.updateState(decoded, true);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static async convertToYaml() {
    try {
      const yamlContent = FormatService.convertToYaml(this.getValue());
      yamlContent && this.updateState(yamlContent, true, 'yaml');
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static async convertToJSON() {
    try {
      const jsonContent = FormatService.convertToJSON(this.getValue());
      jsonContent && this.updateState(jsonContent, true, 'json');
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

  static applyErrorMarkers(errors: any[] = []) { // eslint-disable-line sonarjs/cognitive-complexity
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

    const newDecorations: monacoAPI.editor.IModelDecoration[] = [];
    const newMarkers: monacoAPI.editor.IMarkerData[] = [];
    errors.forEach(err => {
      const { title, detail } = err;
      let location = err.location;
      console.log(location);

      if (!location || location.jsonPointer === '/') {
        const fullRange = model.getFullModelRange();
        location = {};
        location.startLine = fullRange.startLineNumber;
        location.startColumn = fullRange.startColumn;
        location.endLine = fullRange.endLineNumber;
        location.endColumn = fullRange.endColumn;
      }
      const { startLine, startColumn, endLine, endColumn } = location;
  
      newMarkers.push({
        startLineNumber: startLine,
        startColumn,
        endLineNumber: typeof endLine === 'number' ? endLine : startLine,
        endColumn: typeof endColumn === 'number' ? endColumn : startColumn,
        severity: monacoAPI.MarkerSeverity.Error,
        message: `${title}${detail ? `\n${detail}` : ''}`, // eslint-disable-line sonarjs/no-nested-template-literals
      });
  
      if (typeof endLine === 'number' && typeof endColumn === 'number') {
        newDecorations.push({
          id: 'asyncapi',
          ownerId: 0,
          range: new Monaco.Range(startLine, startColumn, endLine, endColumn),
          options: { inlineClassName: 'bg-red-500-20' },
        });
      }
    });
  
    Monaco.editor.setModelMarkers(model, 'asyncapi', newMarkers);
    editor.deltaDecorations(oldDecorations, newDecorations);
  }

  private static fileName = 'asyncapi';

  private static downloadFile(content: string, fileName: string) {
    return fileDownload(content, fileName);
  }
}
