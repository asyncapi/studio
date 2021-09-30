import * as monacoAPI from 'monaco-editor/esm/vs/editor/editor.api';

import { FormatService } from "./format.service";

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
    updateModel: boolean = false,
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
}
