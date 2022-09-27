/// <reference types="react-scripts" />

import type * as monacoAPI from 'monaco-editor/esm/vs/editor/editor.api';
import type { OldAsyncAPIDocument as AsyncAPIDocument } from '@asyncapi/parser/esm';

declare global {
  interface Window {
    // needed by monaco YAML plugin and Studio
    monaco: typeof monacoAPI;
    Editor: monacoAPI.editor.IStandaloneCodeEditor;
    MonacoEnvironment: monacoAPI.Environment | undefined;
    ParsedSpec: AsyncAPIDocument;
  }
}
