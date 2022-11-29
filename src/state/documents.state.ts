import create from 'zustand';

import type { OldAsyncAPIDocument as AsyncAPIDocument, Diagnostic, ParseOutput } from '@asyncapi/parser/cjs';

export type Document = {
  uri: string;
  document?: AsyncAPIDocument;
  extras?: ParseOutput['extras'];
  diagnostics: Diagnostic[];
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