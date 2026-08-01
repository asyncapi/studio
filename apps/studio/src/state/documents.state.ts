import { create } from 'zustand';

import type { AsyncAPIDocumentInterface, Diagnostic, ParseOutput } from '@asyncapi/parser';

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

const emptyDiagnostics: DocumentDiagnostics = {
  original: [],
  filtered: [],
  errors: [],
  warnings: [],
  informations: [],
  hints: [],
};

export const documentsState = create<DocumentsState & DocumentsActions>(set => ({
  documents: {
    asyncapi: {
      uri: 'asyncapi',
      document: undefined,
      extras: undefined,
      diagnostics: emptyDiagnostics,
      valid: false,
    },
  },
  updateDocument(uri: string, document: Partial<Document>) {
    set(state => ({
      documents: (() => {
        const key = String(uri);
        const existing = state.documents[key] || {};
        const merged = { ...existing, ...document };
        return {
          ...state.documents,
          [key]: {
            ...merged,
            uri: key,
            diagnostics: merged.diagnostics ?? emptyDiagnostics,
            valid: merged.valid ?? false,
          },
        };
      })(),
    }));
  },
}));

export const useDocumentsState = documentsState;
