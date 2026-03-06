export interface FileHandle {
  kind: 'file';
  name: string;
  getFile: () => Promise<File>;
}

export interface DirectoryHandle {
  kind: 'directory';
  name: string;
  entries: () => AsyncIterableIterator<[string, DirectoryHandle | FileHandle]>;
  getDirectoryHandle: (name: string) => Promise<DirectoryHandle>;
  getFileHandle: (name: string) => Promise<FileHandle>;
  resolve: (possibleDescendant: FileHandle) => Promise<string[] | null>;
}
