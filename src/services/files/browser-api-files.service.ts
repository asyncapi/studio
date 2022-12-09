import { AbstractFilesService } from './abstract-files.service';

import type { File, Directory, FilesState } from '../../state/files.state';

type DirectoryHandle = {
  id: string;
  handle: FileSystemDirectoryHandle,
  children: Array<DirectoryHandle | FileHandle>;
  parent?: DirectoryHandle;
}

type FileHandle = {
  id: string;
  handle: FileSystemFileHandle,
  parent?: DirectoryHandle;
}

export class BrowserAPIFilesService extends AbstractFilesService {
  private readonly directoryHandles = new Map<string, FileSystemDirectoryHandle>();
  private readonly fileHandles = new Map<string, FileSystemFileHandle>();
  private readonly handles = new Map<string, FileSystemDirectoryHandle | FileSystemFileHandle>();

  async openDirectory() {
    const handle = await window.showDirectoryPicker({
      mode: 'readwrite',
    });
    await this.readDirectory(handle);
  }

  override async createDirectory(directory: Directory): Promise<void> {
    if (this.directoryHandles.has(directory.id)) {
      return;
    }

    const parent = directory.parent;
    if (!parent) {
      return;
    }

    const parentDirectory = this.directoryHandles.get(parent.id);
    if (!parentDirectory) {
      return;
    }

    const handle = await parentDirectory.getDirectoryHandle(directory.name, { create: true });
    this.directoryHandles.set(directory.id, handle);
    this.__createDirectory(directory);
  }

  override async updateDirectory(directory: Partial<Directory>): Promise<void> {
    if (!directory.id || !this.directoryHandles.has(directory.id)) {
      return;
    }
  }

  override async removeDirectory(id: string): Promise<void> {
    const directory = this.getDirectory(id);
    if (!directory) {
      return;
    }

    this.directoryHandles.delete(id);
    if (directory.parent) {
      const parent = directory.parent;
      const parentHandle = this.directoryHandles.get(parent.id);
      if (!parentHandle) {
        return;
      }

      await parentHandle.removeEntry(directory.name, { recursive: true });
      parent.children = parent.children.filter(c => c !== directory);
      this.collectIds(directory.children).forEach(id => {
        this.directoryHandles.delete(id);
        this.fileHandles.delete(id);
      });
    }

    this.__removeDirectory(id);
  }

  override async createFile(file: File): Promise<void> {
    if (this.fileHandles.has(file.id)) {
      return;
    }

    const parent = file.parent;
    if (!parent) {
      return;
    }

    const directory = this.directoryHandles.get(parent.id);
    if (!directory) {
      return;
    }

    const fileName = `${file.name}.${file.language}`;
    const handle = await directory.getFileHandle(fileName, { create: true });
    this.fileHandles.set(file.id, handle);
    this.__createFile(file);
  }

  override async updateFile(file: Partial<File>): Promise<void> {
    if (!file.id || !this.fileHandles.has(file.id)) {
      return;
    }
  }

  override async removeFile(id: string): Promise<void> {
    if (!this.fileHandles.has(id)) {
      return;
    }

    const file = this.getFile(id);
    if (!file || !file.parent) {
      return;
    }

    const parent = file.parent;
    const parentHandle = this.directoryHandles.get(parent.id);
    if (!parentHandle) {
      return;
    }

    const fileName = `${file.name}.${file.language}`;
    await parentHandle.removeEntry(fileName);
    parent.children = parent.children.filter(c => c !== file);
    this.fileHandles.delete(id);
    this.__removeFile(id);
  }

  override async getFileContent(id: string): Promise<string | undefined> {
    const handle = this.fileHandles.get(id);
    if (!handle) {
      return;
    }

    return (await handle.getFile()).text();
  }

  override async saveFileContent(id: string, content: string): Promise<void> {
    const handle = this.fileHandles.get(id);
    if (!handle) {
      return;
    }

    const writable = await handle.createWritable();
		await writable.write(content);
		await writable.close();
  }

  private collectIds(children: Array<Directory | File>, ids: Array<string> = []): Array<string> {
    children.forEach(c => {
      ids.push(c.id);
      if (c.type === 'directory') {
        this.collectIds(c.children, ids);
      }
    });
    return ids;
  }

  private async readDirectory(handle: FileSystemDirectoryHandle) {
    const state: FilesState = { directories: {}, files: {} };
    await this.traverseDirectory(handle, state);
    console.log(state);
    this.mergeState(state);
  }

  private async traverseDirectory(handle: FileSystemDirectoryHandle | FileSystemFileHandle, state: FilesState, parent?: Directory) {
    const uri = parent ? `${parent.uri}/${handle.name}` : `file:///${handle.name}`;
    this.handles.set(uri, handle);

    if (this.isFileSystemDirectoryHandle(handle)) {
      const directory = this.createDirectoryObject({ uri, name: handle.name, parent, from: 'file-system' })
      state.directories[String(directory.id)] = directory;
      if (parent) {
        parent.children.push(directory);
      }

      for await (const entry of handle.values()) {
        await this.traverseDirectory(entry, state, directory);
      }

      directory.children = this.sortChildren(directory.children);
      return;
    }

    const file = this.createFileObject({ uri, name: handle.name, parent, from: 'file-system' })
    state.files[String(file.id)] = file;
    if (parent) {
      parent.children.push(file);
    }
  }

  private isFileSystemDirectoryHandle(handle: FileSystemHandle): handle is FileSystemDirectoryHandle {
		return handle.kind === 'directory';
	}
}
