import create from 'zustand';

import type { OldAsyncAPIDocument as AsyncAPIDocument, Diagnostic, ParseOutput, SpecTypesV2 } from '@asyncapi/parser/cjs';

export type DocumentDiagnostics = {
  original: Diagnostic[];
  filtered: Diagnostic[];
  errors: Diagnostic[];
  warnings: Diagnostic[];
  informations: Diagnostic[];
  hints: Diagnostic[];
}

export type DocumentComponentReference = {
  path: string;
  description?: string;
}

export type Document = {
  filedId: string;
  document: AsyncAPIDocument | null;
  diagnostics: DocumentDiagnostics;
  valid: boolean;
  refs: {
    fromComponents: Record<keyof SpecTypesV2.ComponentsObject, Array<DocumentComponentReference> | undefined>;
    siblingFiles: Array<string>;
  }
  extras?: ParseOutput['extras'];
}

// TODO: Change to the Document | undefined
export type DocumentsState = {
  documents: Record<string, Document>;
}

export const documentsState = create<DocumentsState>(() => ({
  documents: {},
}));

export const useDocumentsState = documentsState;
