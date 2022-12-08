import { AbstractFilesService } from './abstract-files.service';

import type { File, Directory } from '../../state/files.state';

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
  private readonly directoryHandles = new Map<string, DirectoryHandle>();
  private readonly fileHandles = new Map<string, FileHandle>();

  public onInit(): void | Promise<void> {
    
  }

  override async createDirectory(dirId: string, directory: Directory): Promise<void> {
    if (this.directoryHandles.has(dirId)) {
      return this.updateDirectory(dirId, directory);
    }

    const parent = directory.parent;
    if (!parent) {
      return;
    }

    const parentDirectory = this.directoryHandles.get(parent.id);
    if (!parentDirectory) {
      return;
    }

    const handle = await parentDirectory.handle.getDirectoryHandle(directory.name, { create: true });
    const dirHandle: DirectoryHandle = {
      id: dirId,
      handle,
      children: [],
      parent: parentDirectory,
    };
    parentDirectory.children.push(dirHandle);
    this.directoryHandles.set(dirId, dirHandle);
  }

  override async updateDirectory(dirId: string, directory: Partial<Directory>): Promise<void> {
    if (!this.directoryHandles.has(dirId)) {
      return this.createDirectory(dirId, directory as Directory);
    }
  }

  override async removeDirectory(dirId: string): Promise<void> {
    const directory = this.directoryHandles.get(dirId);
    if (directory && directory.parent) {
      const parent = directory.parent;
      await parent.handle.removeEntry(directory.handle.name, { recursive: true });

      parent.children = parent.children.filter(c => c !== directory);
      const ids = this.collectIds(directory.children);
      ids.forEach(id => {
        this.directoryHandles.delete(id);
        this.fileHandles.delete(id);
      });
    }
  }

  override async createFile(fileId: string, file: File): Promise<void> {
    if (this.fileHandles.has(fileId)) {
      return this.updateFile(fileId, file);
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
    const handle = await directory.handle.getFileHandle(fileName, { create: true });
    const fileHandle: FileHandle = {
      id: fileId,
      handle,
      parent: directory,
    };
    directory.children.push(fileHandle);
    this.fileHandles.set(fileId, fileHandle);
  }

  override async updateFile(fileId: string, file: Partial<File>): Promise<void> {
    if (!this.fileHandles.has(fileId)) {
      return this.createFile(fileId, file as File);
    }
  }

  override async removeFile(fileId: string): Promise<void> {
    const file = this.fileHandles.get(fileId);
    if (file && file.parent) {
      const parent = file.parent;
      await parent.handle.removeEntry(file.handle.name);
      parent.children = parent.children.filter(c => c !== file);
      this.fileHandles.delete(fileId);
    }
  }

  override async getFileContent(fileId: string): Promise<string | undefined> {
    const file = this.fileHandles.get(fileId);
    if (file) {
      return (await file.handle.getFile()).text()
    }
  }

  override async saveFileContent(fileId: string, content: string): Promise<void> {
    const file = this.fileHandles.get(fileId);
    if (file) {
			const writable = await file.handle.createWritable();
			await writable.write(content);
			await writable.close();
    }
  }

  private collectIds(children: Array<DirectoryHandle | FileHandle>, ids: Array<string> = []): Array<string> {
    children.forEach(c => {
      ids.push(c.id);
      const children = (c as DirectoryHandle).children;
      if (children) {
        this.collectIds(children, ids);
      }
    });
    return ids;
  }
}
