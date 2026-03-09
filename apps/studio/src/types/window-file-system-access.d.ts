/* eslint-disable no-undef */
export {};

declare global {
  interface Window {
    showDirectoryPicker: (options?: { mode?: 'read' | 'readwrite' }) => Promise<FileSystemDirectoryHandle>;
    showOpenFilePicker: (options?: unknown) => Promise<FileSystemFileHandle[]>;
    showSaveFilePicker: (options?: unknown) => Promise<FileSystemFileHandle>;
  }
}
