/// <reference types="react-scripts" />

import * as monacoAPI from 'monaco-editor/esm/vs/editor/editor.api';
import { AsyncAPIDocument } from '@asyncapi/parser';

declare global {
  interface Window {
    // needed by monaco YAML plugin
    monaco: typeof monacoAPI;
    // needed by Studio
    Monaco: typeof monacoAPI;
    Editor: monacoAPI.editor.IStandaloneCodeEditor;
    MonacoEnvironment: monacoAPI.Environment | undefined;
    ParsedSpec: AsyncAPIDocument;
  }
}
