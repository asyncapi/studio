/* eslint-disable no-undef */
export {};

declare global {
  interface Navigator {
    brave?: {
      isBrave: () => Promise<boolean>;
    };
  }

  interface Window {
    showDirectoryPicker: (options?: { mode?: 'read' | 'readwrite' }) => Promise<FileSystemDirectoryHandle>;
    showOpenFilePicker: (options?: unknown) => Promise<FileSystemFileHandle[]>;
    showSaveFilePicker: (options?: unknown) => Promise<FileSystemFileHandle>;
  }
}
