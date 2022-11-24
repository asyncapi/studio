import create from 'zustand';
import { persist } from 'zustand/middleware';

export type DocumentsState = {
  documents: Record<string, any>
}

export const documentsState = create(
  persist<DocumentsState>(_ => 
    ({
      documents: {},
    }), 
    {
      name: 'studio-documents',
      getStorage: () => localStorage,
    }
  ),
);

export const useDocumentsState = documentsState;
