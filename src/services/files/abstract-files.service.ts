import { AbstractService } from '../abstract.service';
import { Uri } from 'monaco-editor/esm/vs/editor/editor.api';

import { filesState } from '../../state';

import { File, Directory, FilesState, FileFlags } from '../../state/files.state';

export abstract class AbstractFilesService extends AbstractService {
  protected rootDirId: string = '@@root';

  abstract createDirectory(directory: Partial<Directory>): void | Promise<void>;
  abstract updateDirectory(directory: Partial<Directory>): void | Promise<void>;
  abstract removeDirectory(id: string): void | Promise<void>;

  abstract createFile(file: Partial<File>): void | Promise<void>;
  abstract updateFile(file: Partial<File>, options?: { saveContent: boolean }): void | Promise<void>;
  abstract removeFile(id: string): void | Promise<void>;

  // abstract getDirectory(uri: string): Directory | undefined | Promise<Directory | undefined>;

  // abstract getFile(uri: string): File | undefined | Promise<File | undefined>;
  // abstract readFile(uri: string): File | Promise<string>;

  // abstract rename(oldUri: string, newUri: string, options: { overwrite: boolean }): void | Promise<void>;

  abstract getFileContent(id: string): string | undefined | Promise<string | undefined>;
  abstract saveFileContent(id: string, content: string): void | Promise<void>;

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
    if (item.parent && item.parent.id !== this.rootDirId) {
      return `${this.absolutePath(item.parent)}/${item.name}`;
    }
    return item.name;
  }

  createUri(item: File | Directory, schema: string = 'in-memory') {
    if (item.type === 'file') {
      return `${schema}:///${this.absolutePath(item)}.${item.language}`;
    }
    return `${schema}:///${this.absolutePath(item)}`;
  }

  getDirectory(uri: string): Directory | undefined {
    return filesState.getState().directories[String(uri)];
  }

  hasDirectory(fileId: string) {
    return Boolean(this.getDirectory(fileId));
  }

  getDirectoryByUri(uri: string): Directory | undefined {
    return Object.values(filesState.getState().directories).find(f => f.uri === uri);
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

  getFileByUri(uri: string): File | undefined {
    if (!uri.includes(':///')) {
      uri = uri.replace(':/', ':///');
    }
    return Object.values(filesState.getState().files).find(f => f.uri === uri);
  }

  isFileModified(fileOrId: File | string) {
    let file: File | undefined;
    if (typeof fileOrId === 'string') {
      file = this.svcs.filesSvc.getFile(fileOrId);
    } else {
      file = fileOrId;
    }

    if (file) {
      return Boolean(file.flags & FileFlags.MODIFIED);
    }
    return false;
  }

  getFiles() {
    return filesState.getState().files;
  }

  getRootDirectory() {
    return this.getDirectory(this.rootDirId) || this.createRootDirectory();
  }

  hasInDeepChildren(directory: Directory, itemId: string): boolean {
    return Boolean(this.getInDeepChildren(directory, itemId));
  }

  getInDeepChildren(directory: Directory, itemId: string): Directory | File | undefined {
    for (const child of directory.children) {
      if (child.id === itemId) {
        return child;
      }
      if (child.type === 'directory') {
        return this.getInDeepChildren(child, itemId);
      }
    }
  }

  getState() {
    return filesState.getState();
  }

  setState(state: Partial<FilesState>) {
    filesState.setState(state);
  }

  protected __createDirectory(directory: Directory) {
    const dirId = directory.id;
    if (dirId && this.hasDirectory(dirId)) {
      return;
    }

    let [, directories] = this.mergeDirectories(directory);
    this.emitCreateDirectory(directory);
    const parent = directory.parent;
    if (!parent) {
      return this.setState({ directories });
    }
  
    const [newParent, newDirectories] = this.mergeDirectories({ children: this.addChildren(parent, [directory]) }, parent.id, directories);
    this.emitCreateDirectory(newParent);
    return this.setState({ directories: newDirectories });
  }

  protected __updateDirectory(directory: Partial<Directory>) {
    const existingDirectory = directory.id && this.getDirectory(directory.id);
    if (!existingDirectory) {
      return;
    }

    const parent = directory.parent;
    const existingParent = existingDirectory.parent;
    const [newDirectory, directories] = this.mergeDirectories(directory, existingDirectory.id);
    this.emitUpdateDirectory(newDirectory, existingDirectory);
    if (!parent || (existingParent === parent)) {
      return this.setState({ directories });
    }
  
    // TODO: Add moving directories
    return this.setState({ directories });
  }

  protected __removeDirectory(id: string) {
    const directory = this.getDirectory(id);
    if (!directory) {
      return;
    }
  
    let directories = { ...this.getDirectories() };
    this.emitRemoveDirectory(directory);
    delete directories[String(id)];

    const parent = directory.parent;
    if (directory.children.length === 0) {
      if (parent) {
        const [newParent, filteredDirectories] = this.mergeDirectories({ 
          children: parent.children.filter(c => !(c.id === id && c.type === 'directory')),
        }, parent.id);
        directories = { 
          ...directories, 
          ...filteredDirectories,
        };
        this.emitUpdateDirectory(newParent, parent);
      }
      return this.setState({ directories });
    }
  
    const files = { ...this.getFiles() };
    const children = this.collectChildren(directory.children);
    for (let child of children.reverse()) {
      if (child.type === 'directory') {
        const directory = directories[String(child.id)];
        if (directory) {
          this.emitRemoveDirectory(directory);
          delete directories[String(child.id)];
        }
      } else {
        const file = files[String(child.id)];
        if (file) {
          this.emitRemoveFile(file);
          delete files[String(child.id)];
        }
      }
    }

    if (parent) {
      const [newParent, filteredDirectories] = this.mergeDirectories({ 
        children: parent.children.filter(c => !(c.id === id && c.type === 'directory')),
      }, parent.id);
      directories = {
        ...directories, 
        ...filteredDirectories,
      };
      this.emitUpdateDirectory(newParent, parent);
    }
  
    return this.setState({ files, directories });
  }

  protected __createFile(file: File) {
    const fileId = file.id;
    if (fileId && this.hasDirectory(fileId)) {
      return;
    }

    const [, files] = this.mergeFiles(file);
    this.emitCreateFile(file);
    const parent = file.parent;
    if (!parent) {
      return this.setState({ files });
    }
  
    const [newParent, directories] = this.mergeDirectories({ 
      children: this.addChildren(parent, [file])
    }, parent.id);
    this.emitUpdateDirectory(newParent, parent);
    return this.setState({ files, directories });
  }

  protected async __updateFile(file: Partial<File>) {
    const existingFile = file.id && this.getFile(file.id);
    if (!existingFile) {
      return;
    }
  
    const parent = file.parent;
    const existingParent = existingFile.parent as Directory;
    const [newFile, files] = this.mergeFiles(file, existingFile.id);

    // check if content is modified
    const savedContent = await this.svcs.filesSvc.getFileContent(newFile.id);
    if (savedContent !== newFile.content) {
      // set modified flag
      newFile.flags |= FileFlags.MODIFIED;
    } else {
      // remove modified flag
      newFile.flags &= ~FileFlags.MODIFIED;
    }

    this.emitUpdateFile(newFile, existingFile);
    if (!parent || (existingParent === parent)) {
      return this.setState({ files });
    }
  
    // moving file - TODO: add removing previous file
    const [newExistingParent, existingDirs] = this.mergeDirectories({ children: existingParent.children.filter(c => !(c.id === newFile.id && c.type === 'file')), }, existingParent.id);
    const [newParent, directories] = this.mergeDirectories({ children: this.addChildren(parent, [newFile]), }, parent.id, existingDirs);
    this.emitUpdateDirectory(newExistingParent, existingParent);
    this.emitUpdateDirectory(newParent, parent);
    return this.setState({ files, directories });
  }

  protected __removeFile(id: string) {
    const file = this.getFile(id);
    if (!file) {
      return;
    }
  
    const files = { ...this.getFiles() };
    this.emitRemoveFile(file);
    delete files[String(id)];
  
    const parent = file.parent;
    if (!parent) {
      return this.setState({ files });
    }

    const [newParent, directories] = this.mergeDirectories({ 
      children: parent.children.filter(c => !(c.id === id && c.type === 'file'))
    }, parent.id);
    this.emitUpdateDirectory(newParent, parent);
    return this.setState({ files, directories });
  }

  protected createDirectoryObject(directory: Partial<Directory>, { schema }: { schema?: 'file' | 'in-memory' } = {}): Directory {
    schema = schema || 'in-memory';
    const id = directory.id || this.svcs.formatSvc.generateUuid();
    const mtime = directory?.stat?.mtime || this.svcs.formatSvc.getCurrentTime();

    const newDirectory: Directory = {
      uri: '',
      name: '',
      children: [],
      flags: FileFlags.NONE,
      stat: {
        ...directory?.stat || {},
        mtime,
      },
      ...directory,
      id,
      type: 'directory',
      from: directory.from || 'in-memory',
    };
    newDirectory.uri = newDirectory.uri || this.createUri(newDirectory, schema);
    return newDirectory;
  }
  
  protected createFileObject(file: Partial<File>, { schema }: { schema?: 'file' | 'in-memory' } = {}): File {
    schema = schema || 'in-memory';
    const { name, language } = this.serializeName(file.name, file.language);
    const id = file.id || this.svcs.formatSvc.generateUuid();
    const mtime = file?.stat?.mtime || this.svcs.formatSvc.getCurrentTime();

    const newFile: File = {
      uri: '',
      content: '',
      contentVersion: 0,
      flags: FileFlags.NONE,
      stat: {
        ...file?.stat || {},
        mtime,
      },
      ...file,
      id,
      name,
      type: 'file',
      language,
      parent: file.parent || this.getRootDirectory(),
      from: file.from || 'in-memory',
    };
    newFile.uri = newFile.uri || this.createUri(newFile, schema);
    return newFile;
  }

  private createRootDirectory() {
    let rootDirectory = this.getDirectory(this.rootDirId);
    if (rootDirectory) {
      return rootDirectory;
    }

    const rootDirId = this.rootDirId;
    rootDirectory = this.createDirectoryObject({ from: 'in-memory', name: rootDirId, id: rootDirId });
    this.mergeState({ directories: { [String(rootDirId)]: rootDirectory } });
    return rootDirectory;
  }

  private serializeName(name: string = '', language: string = ''): { name: string, language: 'json' | 'yaml' } {
    const parts = name.split('.');
    if (parts.length > 1) {
      language = parts.pop() || '';
      name = parts.join('.');
    }

    if (!['json', 'yaml'].includes(language) || language === 'yml') {
      language = 'yaml';
    };

    return { name: name, language: (language as 'json' | 'yaml') };
  }

  protected mergeDirectories(directory: Partial<Directory>, id?: string, oldDirectories?: Record<string, Directory>): [Directory, Record<string, Directory>] {
    const dirId = id || directory.id;
    let existingDirectory: Directory | undefined = undefined
    if (dirId) {
      existingDirectory = this.getDirectory(dirId);
    }

    if (existingDirectory) {
      directory = { ...existingDirectory, ...directory };
    } else {
      directory = this.createDirectoryObject(directory);
    }
    return [directory, { ...(oldDirectories || this.getDirectories()), [String(directory.id)]: directory }] as [Directory, Record<string, Directory>];
  }

  protected mergeFiles(file: Partial<File>, id?: string, oldFiles?: Record<string, File>): [File, Record<string, File>] {
    const fileId = id || file.id;
    let existingFile: File | undefined = undefined
    if (fileId) {
      existingFile = this.getFile(fileId);
    }

    if (existingFile) {
      file = { ...existingFile, ...file };
    } else {
      file = this.createFileObject(file);
    }
    return [file, { ...(oldFiles || this.getFiles()), [String(file.id)]: file }] as [File, Record<string, File>];
  }

  protected mergeState(newState: Partial<FilesState> = {}) {
    return filesState.setState(state => ({
      directories: { ...state.directories, ...newState.directories || {} },
      files: { ...state.files, ...newState.files || {} },
    }));
  }
  
  protected addChildren(directory: Directory, children: Array<Directory | File>) {
    return this.sortChildren([...directory.children, ...children]);
  }

  protected sortChildren(children: Array<Directory | File>) {
    return [...children].sort(this.sortFunction);
  }

  protected sortDirectories(directories: Record<string, Directory>) {
    const sorted: Record<string, Directory> = {};
    Object.values(directories).forEach(directory => {
      sorted[String(directory.id)] = {
        ...directory,
        children: this.sortChildren(directory.children),
      }
    });
    return sorted;
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

  private collectChildren(children: Array<Directory | File>, collection: Array<Directory | File> = []): Array<Directory | File> {
    children.forEach(c => {
      collection.push(c);
      if (c.type === 'directory') {
        this.collectChildren(c.children, collection);
      }
    });
    return collection;
  }

  protected emitCreateDirectory(directory: Directory) {
    this.svcs.eventsSvc.emit('fs.directory.create', directory);
  }

  protected emitUpdateDirectory(directory: Directory, prevDirectory: Directory) {
    this.svcs.eventsSvc.emit('fs.directory.update', directory, prevDirectory);
  }

  protected emitRemoveDirectory(directory: Directory) {
    this.svcs.eventsSvc.emit('fs.directory.remove', directory);
  }

  protected emitCreateFile(file: File) {
    this.svcs.eventsSvc.emit('fs.file.create', file);
  }

  protected emitUpdateFile(file: File, prevFile: File) {
    this.svcs.eventsSvc.emit('fs.file.update', file, prevFile);
  }

  protected emitRemoveFile(file: File) {
    this.svcs.eventsSvc.emit('fs.file.remove', file);
  }
}
