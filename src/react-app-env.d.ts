/// <reference types="react-scripts" />

import * as monacoAPI from 'monaco-editor/esm/vs/editor/editor.api';
import { AsyncAPIDocument } from '@asyncapi/parser';

declare global {
  interface Window {
    // needed by monaco YAML plugin and Studio
    monaco: typeof monacoAPI;
    Editor: monacoAPI.editor.IStandaloneCodeEditor;
    MonacoEnvironment: monacoAPI.Environment | undefined;
    ParsedSpec: AsyncAPIDocument;
  }
}
