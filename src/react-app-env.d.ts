/// <reference types="react-scripts" />

import * as monacoAPI from 'monaco-editor/esm/vs/editor/editor.api';

declare global {
  interface Window {
    Monaco: typeof monacoAPI;
    Editor: monacoAPI.editor.IStandaloneCodeEditor;
  }
}
