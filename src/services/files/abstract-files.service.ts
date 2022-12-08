import { AbstractService } from '../abstract.service';
import { Uri } from 'monaco-editor/esm/vs/editor/editor.api';

import { filesState } from '../../state';

import { File, Directory, FilesState, FileFlags } from '../../state/files.state';

export abstract class AbstractFilesService extends AbstractService {
  abstract createDirectory(fileId: string, directory: Partial<Directory>): void | Promise<void>;
  abstract updateDirectory(fileId: string, directory: Partial<Directory>): void | Promise<void>;
  abstract removeDirectory(fileId: string): void | Promise<void>;

  abstract createFile(fileId: string, file: Partial<File>): void | Promise<void>;
  abstract updateFile(fileId: string, file: Partial<File>): void | Promise<void>;
  abstract removeFile(fileId: string): void | Promise<void>;

  // abstract getDirectory(uri: string): Directory | undefined | Promise<Directory | undefined>;

  // abstract getFile(uri: string): File | undefined | Promise<File | undefined>;
  // abstract readFile(uri: string): File | Promise<string>;

  // abstract rename(oldUri: string, newUri: string, options: { overwrite: boolean }): void | Promise<void>;

  abstract getFileContent(fileId: string): string | undefined | Promise<string | undefined>;
  abstract saveFileContent(fileId: string, content: string): void | Promise<void>;

  // TOOD: Probably it's not needed
  toFileUri(pathOrUri: string | Uri): Uri {
    if (typeof pathOrUri === 'string') {
      pathOrUri = Uri.file(pathOrUri.replace(/^file:\/\/\//, ''));
    }
    return pathOrUri;
  }

  toUri(uri: string | Uri): Uri {
    if (typeof uri === 'string') {
      return Uri.parse(uri);
    }
    return uri;
  }

  toFileUriString(pathOrUri: string | Uri): string {
    pathOrUri = this.toFileUri(pathOrUri);
    return pathOrUri.toString();
  }

  // https://stackoverflow.com/questions/190852/how-can-i-get-file-extensions-with-javascript/12900504#12900504	
	extension(fname: string | Uri): string {
    fname = this.toFileUri(fname);
    return fname.path.slice((fname.path.lastIndexOf(".") - 1 >>> 0) + 2);
  }

	filename(path: string | Uri): string {
		path = this.toFileUri(path);
		return path.path.split('/').pop() || '';
	}

  dirname(path: string | Uri): string {
		path = this.toFileUri(path);
    return path.path.substring(0, path.path.lastIndexOf("/"));
  }

  basename(path: string | Uri): string {
    path = this.toFileUri(path);
    return path.path.substring(path.path.lastIndexOf('/') + 1);
	}

  absolutePath(item: File | Directory): string {
    if (item.parent && item.parent.id !== 'root') {
      return `${this.absolutePath(item.parent)}/${item.name}`;
    }
    return item.name;
  }

  getDirectory(uri: string): Directory | undefined {
    return filesState.getState().directories[String(uri)];
  }

  hasDirectory(fileId: string) {
    return Boolean(this.getDirectory(fileId));
  }

  getDirectories() {
    return filesState.getState().directories;
  }

  getFile(fileId: string): File | undefined {
    return filesState.getState().files[String(fileId)];
  }

  hasFile(fileId: string) {
    return Boolean(this.getFile(fileId));
  }

  isFileModified(fileId: string) {
    const file = this.getFile(fileId);
    if (file) {
      return Boolean(file.flags & FileFlags.MODIFIED);
    }
    return false;
  }

  getFiles() {
    return filesState.getState().files;
  }

  getRootDirectory(): Directory {
    return this.getDirectory('root') as Directory;
  }

  getState() {
    return filesState.getState();
  }

  setState(state: Partial<FilesState>) {
    filesState.setState(state);
  }

  protected createDirectoryObject(uri: string, directory: Partial<Directory>): Directory {
    const id = directory.id || this.svcs.formatSvc.generateUuid();
    const mtime = directory?.stat?.mtime || this.svcs.formatSvc.getCurrentTime();

    return {
      id,
      type: 'directory',
      uri,
      name: directory.name || uri,
      children: [],
      from: 'in-memory',
      flags: FileFlags.NONE,
      stat: {
        ...directory?.stat || {},
        mtime,
      },
      ...directory
    }
  }
  
  protected createFileObject(uri: string, file: Partial<File>): File {
    const id = file.id || this.svcs.formatSvc.generateUuid();
    const mtime = file?.stat?.mtime || this.svcs.formatSvc.getCurrentTime();

    return {
      id,
      type: 'file',
      uri,
      name: file.name || uri,
      content: '',
      contentVersion: 0,
      language: 'yaml',
      from: file.from || 'in-memory',
      parent: file.parent || this.getRootDirectory(),
      flags: FileFlags.NONE,
      stat: {
        ...file?.stat || {},
        mtime,
      },
      ...file
    }
  }

  protected mergeDirectories(uri: string, directory: Partial<Directory>): [Directory, Record<string, Directory>] {
    const existingDirectory = this.getDirectory(uri);
    if (existingDirectory) {
      directory = { ...existingDirectory, ...directory };
    } else {
      directory = this.createDirectoryObject(uri, directory);
    }
    return [directory, { ...this.getDirectories(), [String(uri)]: directory }] as [Directory, Record<string, Directory>];
  }

  protected mergeFiles(uri: string, file: Partial<File>): [File, Record<string, File>] {
    const existingFile = this.getFile(uri);
    if (existingFile) {
      file = { ...existingFile, ...file };
    } else {
      file = this.createFileObject(uri, file);
    }
    return [file, { ...this.getFiles(), [String(uri)]: file }] as [File, Record<string, File>];
  }
  
  protected addChildren(directory: Directory, children: Array<Directory | File>) {
    return this.sortChildren([...directory.children, ...children]);
  }

  protected sortChildren(children: Array<Directory | File>) {
    return [...children].sort(this.sortFunction);
  }

  protected sortFunction(a: File | Directory, b: File | Directory) {
    const isADirectory = a.type === 'directory';
    const isBDirectory = b.type === 'directory';
    // directories
    if (isADirectory || isBDirectory) {
      if (isADirectory && isBDirectory) {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;
      }
      return isADirectory ? -1 : 1;
    }
    // files
    if (a.name > b.name) return 1;
    if (a.name < b.name) return -1;
    return 0;
  }
}
