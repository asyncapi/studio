export type DirectoryHandle = Awaited<ReturnType<Window['showDirectoryPicker']>>;
export type FileHandle = Awaited<ReturnType<Window['showOpenFilePicker']>>[number];
