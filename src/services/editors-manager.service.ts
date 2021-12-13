import * as monacoAPI from 'monaco-editor/esm/vs/editor/editor.api';

import { PanelTabID } from './panels-manager.service';

export interface EditorInstance {
  instance: monacoAPI.editor.IStandaloneCodeEditor;
  state: any;
}

export class EditorsManager {
  static editors: Map<PanelTabID, EditorInstance> = new Map();

  static getEditor(tabID: PanelTabID) {
    return this.editors.get(tabID);
  }

  static addEditor(instance: monacoAPI.editor.IStandaloneCodeEditor, tabID: PanelTabID): void {
    this.editors.set(tabID, { instance, state: { decorations: [] } });
  }

  static deleteEditor(tabID: PanelTabID): void {
    this.editors.delete(tabID);
  }

  static applyErrorMarkers(errors: any[] = [], tabID: PanelTabID) {
    const maybeEditor = this.getEditor(tabID);
    const Monaco = window.Monaco;
    if (!maybeEditor || !Monaco) {
      return;
    }
    const editor = maybeEditor.instance;
    const model = editor.getModel();
    if (!model) {
      return;
    }
    
    const oldDecorations = maybeEditor.state.decorations || [];
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
}
