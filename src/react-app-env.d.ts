/// <reference types="react-scripts" />

import type { Environment } from 'monaco-editor/esm/vs/editor/editor.api';

declare global {
  interface Window {
    MonacoEnvironment: Environment | undefined;
  }
}
