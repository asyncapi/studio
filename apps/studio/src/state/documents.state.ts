import create from 'zustand';

import type { AsyncAPIDocumentInterface, Diagnostic, ParseOutput } from '@asyncapi/parser/cjs';

export type DocumentDiagnostics = {
  original: Diagnostic[];
  filtered: Diagnostic[];
  errors: Diagnostic[];
  warnings: Diagnostic[];
  informations: Diagnostic[];
  hints: Diagnostic[];
}

export type Document = {
  uri: string;
  document?: AsyncAPIDocumentInterface;
  extras?: ParseOutput['extras'];
  diagnostics: DocumentDiagnostics;
  valid?: boolean;
}

export type DocumentsState = {
  documents: Record<string, Document>; 
}

export type DocumentsActions = {
  updateDocument: (uri: string, document: Partial<Document>) => void;
}

export const documentsState = create<DocumentsState & DocumentsActions>(set => ({
  documents: {},
  updateDocument(uri: string, document: Partial<Document>) {
    set(state => ({ documents: { ...state.documents, [String(uri)]: { ...state.documents[String(uri)] || {}, ...document } } }));
  },
}));

export const useDocumentsState = documentsState;