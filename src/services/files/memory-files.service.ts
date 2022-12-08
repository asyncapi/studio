import { AbstractFilesService } from './abstract-files.service';

import Dexie from 'dexie';

import { FileFlags, schema } from '../../state/files.state';

import type { Table } from 'dexie';
import type { Directory, File } from '../../state/files.state';

const files: Record<string, File> = {
  'file1': {
    id: 'file1',
    type: 'file',
    uri: 'file1',
    name: 'file1',
    content: '',
    contentVersion: 0,
    from: 'in-memory',
    source: undefined,
    language: schema.trimStart()[0] === '{' ? 'json' : 'yaml',
    flags: FileFlags.NONE,
    stat: {
      mtime: (new Date()).getTime(),
    }
  },
  'file2': {
    id: 'file2',
    type: 'file',
    uri: 'file:///file2',
    name: 'file2',
    content: 'lol: 1.2.0',
    contentVersion: 0,
    from: 'in-memory',
    source: undefined,
    language: schema.trimStart()[0] === '{' ? 'json' : 'yaml',
    flags: FileFlags.NONE,
    stat: {
      mtime: (new Date()).getTime(),
    }
  },
  'file3': {
    id: 'file3',
    type: 'file',
    uri: 'file:///file3',
    name: 'file3',
    content: '',
    contentVersion: 0,
    from: 'in-memory',
    source: undefined,
    language: schema.trimStart()[0] === '{' ? 'json' : 'yaml',
    flags: FileFlags.NONE,
    stat: {
      mtime: (new Date()).getTime(),
    }
  },
  'asyncapi': {
    id: 'asyncapi',
    type: 'file',
    uri: 'file:///asyncapi',
    name: 'asyncapi',
    content: schema,
    contentVersion: 0,
    from: 'in-memory',
    source: undefined,
    language: schema.trimStart()[0] === '{' ? 'json' : 'yaml',
    flags: FileFlags.NONE,
    stat: {
      mtime: (new Date()).getTime(),
    }
  },
}

const rootDirectory: Directory = {
  id: 'root',
  type: 'directory',
  uri: 'file:///root',
  name: 'root',
  children: [],
  from: 'in-memory',
  flags: FileFlags.NONE,
}

const directories: Record<string, Directory> = {
  'dir1': {
    id: 'dir1',
    type: 'directory',
    uri: 'file:///dir1',
    name: 'dir1',
    children: [files['file3']],
    from: 'in-memory',
    flags: FileFlags.NONE,
    parent: rootDirectory,
  },
  'dir2': {
    id: 'dir2',
    type: 'directory',
    uri: 'file:///dir2',
    name: 'dir2',
    children: [files['file2']],
    from: 'in-memory',
    flags: FileFlags.NONE,
    parent: rootDirectory,
  }
}

/**
 * Each operation is performed by the state. 
 * This class is a placeholder to implement the appropriate interface.
 */
export class MemoryFilesService extends AbstractFilesService {
  private database!: Dexie;
  private directories!: Table<Directory>; 
  private files!: Table<File>; 

  async onInit() {
    const database = this.database = new Dexie('in-memory-files');

    database.version(1).stores({
      directories: '&id, type, uri, name, from, flags, stat.mtime, parent, children',
      files: '&id, type, uri, name, from, flags, stat.mtime, parent, content, language, source',
    });

    this.directories = (database as any).directories;
    this.files = (database as any).files;

    const asyncapiFile = files.asyncapi;
    asyncapiFile.parent = rootDirectory;
    (rootDirectory.children as any) = [asyncapiFile];

    try {
      await this.createDirectory('root', rootDirectory);
      await this.createFile('asyncapi', asyncapiFile);
    } catch(e) {
      console.log(e);
    }

    if (Object.keys(this.getState().directories).length) {
      return;
    }

    const state = {
      files: {
        asyncapi: asyncapiFile,
      },
      directories: {
        root: rootDirectory,
      }
    };
    this.setState(state);
  }

  override async createDirectory(_: string, directory: Directory) {
    await this.directories.add(this.serializeDirectory(directory) as Directory);
  }

  override async updateDirectory(dirId: string, directory: Partial<Directory>) {
    await this.files.update(dirId, this.serializeDirectory(directory));
  }

  override async removeDirectory(dirId: string) {
    await this.directories.delete(dirId);
  }

  override async createFile(_: string, file: File) {
    await this.files.add(this.serializeFile(file) as File);
  }

  override async updateFile(fileId: string, file: Partial<File>) {
    await this.files.update(fileId, this.serializeFile(file));
  }

  override async removeFile(fileId: string) {
    await this.files.delete(fileId);
  }

  override async getFileContent(fileId: string) {
    const file = await this.getMemoryFile(fileId);
    return file?.content;
  }

  override async saveFileContent(fileId: string, content: string) {
    const file = await this.getMemoryFile(fileId);
    await this.updateFile(fileId, { content });
  }

  private getMemoryFile(fileId: string) {
    return this.files.get(fileId);
  }

  private serializeDirectory(directory: Partial<Directory>): Partial<Directory> {
    return {
      ...directory,
      children: (directory.children || []).map(d => d.id) as any,
    }
  }

  private serializeFile(file: Partial<File>): Partial<File> {
    return {
      ...file,
      parent: file.parent?.id as any,
    }
  }
}
