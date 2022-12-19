import { AbstractFilesService } from './abstract-files.service';

import Dexie from 'dexie';

import type { Table } from 'dexie';
import type { File, Directory, FilesState } from '../../state/files.state';

export class BrowserAPIFilesService extends AbstractFilesService {
  private dbHandles!: Table<{ name: string, handle: FileSystemDirectoryHandle }>;
  private readonly rootHandles = new Map<string, FileSystemDirectoryHandle>();
  private readonly directoryHandles = new Map<string, FileSystemDirectoryHandle>();
  private readonly fileHandles = new Map<string, FileSystemFileHandle>();
  private readonly handles = new Map<string, FileSystemDirectoryHandle | FileSystemFileHandle>();

  override async onInit() {
    if (!this.isSupportedBrowserAPI()) {
      return;
    }

    const database = new Dexie('fs-directory-handles');
    database.version(1).stores({
      handles: '++, name, handle',
    });

    this.dbHandles = (database as any).handles;
    const rootHandles = await this.dbHandles.toArray();
    if (rootHandles.length) {
      rootHandles.forEach(({ name, handle }) => {
        this.rootHandles.set(name, handle);
      });
    }
  }

  override async onAfterAppInit() {
    // const rootHandles = await this.dbHandles.toArray();

    // if (rootHandles[0]) {
    //   const handle = rootHandles[0].handle;
    //   if (await this.verifyPermission(handle)) {
    //     for await (const entry of handle.values()) {
    //       console.log(entry);
    //     }
    //   }
    // }
  }

  async openDirectory() {
    if (!this.isSupportedBrowserAPI()) {
      return;
    }

    const handle = await window.showDirectoryPicker({
      mode: 'readwrite',
    });

    let exist = false;
    for (const savedHandle of this.rootHandles.values()) {
      if (await handle.isSameEntry(savedHandle)) {
        exist = true;
        break;
      }
    }

    // TOOD: Add notification with information that given directory is used
    if (exist) {
      return;
    }

    const name = handle.name;
    this.dbHandles.add({ name, handle });
    this.rootHandles.set(name, handle);
    await this.readDirectory(handle);
  }

  isSupportedBrowserAPI() {
    return typeof window === 'object' && 'showOpenFilePicker' in window;
  }

  hasBrowserAPIDirectories(): boolean {
    return this.rootHandles.size > 0;
  }

  async restoreDirectories() {
    for (const handle of this.rootHandles.values()) {
      if (await this.verifyPermission(handle)) {
        await this.readDirectory(handle);
      }
    }
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

  override async updateFile(file: Partial<File>, options?: { saveContent: boolean }): Promise<void> {
    if (!file.id || !this.fileHandles.has(file.id)) {
      return;
    }

    // save content
    if (options?.saveContent && typeof file.content === 'string') {
      await this.saveFileContent(file.id, file.content);
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
		await writable.write(content || '');
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
    const state = this.getState();
    await this.traverseDirectory(handle, state, this.getRootDirectory());
    state.directories = this.sortDirectories(state.directories);
    this.mergeState(state);
  }

  private async traverseDirectory(handle: FileSystemDirectoryHandle | FileSystemFileHandle, state: FilesState, parent: Directory) {
    let item: File | Directory;

    if (this.isFileSystemDirectoryHandle(handle)) {
      item = this.createDirectoryObject({ name: handle.name, parent, from: 'file-system' }, { schema: 'file' });
      state.directories[String(item.id)] = item;

      for await (const entry of handle.values()) {
        await this.traverseDirectory(entry, state, item);
      }

      item.children = this.sortChildren(item.children);
    } else {
      item = this.createFileObject({ name: handle.name, parent, from: 'file-system' }, { schema: 'file' });
      state.files[String(item.id)] = item;
    }

    this.handles.set(item.uri, handle);
    if (parent) {
      parent.children.push(item);
    }
  }

  private isFileSystemDirectoryHandle(handle: FileSystemHandle): handle is FileSystemDirectoryHandle {
		return handle.kind === 'directory';
	}

  private watchHandles() {
    let mutex = false;
    setInterval(async () => {
      if (mutex) {
        return;
      }
      mutex = true;
      mutex = false;
    }, 1000);
  }

  private async refreshDirectory(handle: FileSystemDirectoryHandle) {

  }

  private async verifyPermission(handle: FileSystemDirectoryHandle) {
    try {
      // Check if permission was already granted. If so, return true.
      if ((await handle.queryPermission({ mode: 'readwrite' })) === 'granted') {
        return true;
      }
      // Request permission. If the user grants permission, return true.
      if ((await handle.requestPermission({ mode: 'readwrite' })) === 'granted') {
        return true;
      }
      // The user didn't grant permission, so return false.
      return false;
    } catch(err) {
      console.log(err);
      return false;
    }
  }
}
