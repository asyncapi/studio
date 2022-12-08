import create from 'zustand';

import type { OldAsyncAPIDocument as AsyncAPIDocument, Diagnostic, ParseOutput } from '@asyncapi/parser/cjs';

export type DocumentDiagnostics = {
  original: Diagnostic[];
  filtered: Diagnostic[];
  errors: Diagnostic[];
  warnings: Diagnostic[];
  informations: Diagnostic[];
  hints: Diagnostic[];
}

export type Document = {
  filedId: string;
  document: AsyncAPIDocument | null;
  diagnostics: DocumentDiagnostics;
  valid: boolean;
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
