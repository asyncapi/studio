import { AbstractFilesService } from './abstract-files.service';

import Dexie from 'dexie';

import type { Table } from 'dexie';
import type { Directory, File } from '../../state/files.state';

type TableDirectory = {
  children: string[];
  parent: string;
} & Omit<Directory, 'children' | 'parent'>;

type TableFile = {
  parent: string;
} & Omit<File, 'parent'>;

/**
 * Each operation is performed by the state. 
 * This class is a placeholder to implement the appropriate interface.
 */
export class MemoryFilesService extends AbstractFilesService {
  private database!: Dexie;
  private directories!: Table<TableDirectory>; 
  private files!: Table<TableFile>; 

  async onInit() {
    const database = this.database = new Dexie('in-memory-files');

    database.version(1).stores({
      directories: '&id, type, uri, name, from, flags, stat.mtime, parent, children',
      files: '&id, type, uri, name, from, flags, stat.mtime, parent, content, language, source',
    });

    this.directories = (database as any).directories;
    this.files = (database as any).files;

    await this.readFiles();
  }

  override async createDirectory(directory: Directory) {
    if (await this.directories.get(directory.id)) {
      return;
    }

    try {
      const tableDirectory = this.serializeDirectory(directory);
      await this.directories.add(tableDirectory);

      const parent = directory.parent && await this.directories.get(directory.parent.id);
      if (parent) {
        parent.children.push(directory.id)
        await this.directories.update(parent.id, parent);     
      }

      this.__createDirectory(directory);
    } catch(err) {
      console.error(err);
    }
  }

  override async updateDirectory(directory: Partial<Directory>) {
    if (!directory.id || !(await this.directories.get(directory.id))) {
      return;
    }

    try {
      const tableDirectory = this.serializeDirectory(directory);
      await this.directories.update(directory.id, tableDirectory);
      this.__updateDirectory(directory);
    } catch(err) {
      console.error(err);
    }
  }

  override async removeDirectory(id: string) {
    try {
      const directory = await this.directories.get(id);
      if (!directory) {
        return;
      }

      await this.directories.delete(id);
      await this.removeChildren(directory.children);

      const parent = directory.parent && await this.directories.get(directory.parent);
      if (parent) {
        parent.children = parent.children.filter(child => child !== directory.id);
        await this.directories.update(parent.id, parent);        
      }

      this.__removeDirectory(id);
    } catch(err) {
      console.error(err);
    }
  }

  override async createFile(file: File) {
    if (await this.files.get(file.id)) {
      return;
    }

    try {
      await this.files.add(this.serializeFile(file));

      const parent = file.parent && await this.directories.get(file.parent.id);
      if (parent) {
        parent.children.push(file.id)
        await this.directories.update(parent.id, parent);
      }

      this.__createFile(file);
    } catch(err) {
      console.error(err);
    }
  }

  override async updateFile(file: Partial<File>) {
    if (!file.id || !(await this.files.get(file.id))) {
      return;
    }

    try {
      await this.files.update(file.id, this.serializeFile(file));
      this.__updateFile(file);
    } catch(err) {
      console.error(err);
    }
  }

  override async removeFile(id: string) {
    try {
      const file = await this.files.get(id);
      if (!file) {
        return;
      }

      await this.files.delete(id);
      const parent = file.parent && await this.directories.get(file.parent);
      if (parent) {
        parent.children = parent.children.filter(child => child !== file.id);
        await this.directories.update(parent.id, parent);   
      }

      this.__removeFile(id);
    } catch(err) {
      console.error(err);
    }
  }

  override async getFileContent(id: string) {
    const file = await this.files.get(id);
    return file?.content;
  }

  override async saveFileContent(id: string, content: string) {
    await this.updateFile({ id, content });
  }

  private serializeDirectory(directory: Directory): TableDirectory;
  private serializeDirectory(directory: Partial<Directory>): Partial<TableDirectory>;
  private serializeDirectory(directory: Partial<Directory>): Partial<TableDirectory> {
    return {
      ...directory,
      children: directory.children?.map(c => c.id) || [],
      parent: directory.parent?.id,
    }
  }

  private serializeFile(file: File): TableFile;
  private serializeFile(file: Partial<File>): Partial<TableFile>;
  private serializeFile(file: Partial<File>): Partial<TableFile> {
    return {
      ...file,
      parent: file.parent?.id,
    }
  }

  private async removeChildren(children: Array<string>) {
    return Promise.all(
      children.map(async child => {
        if (await this.directories.get(child)) {
          return this.directories.delete(child);
        }
        if (await this.files.get(child)) {
          return this.files.delete(child);
        }
      })
    );
  }

  private async readFiles() {
    const allDirectories = await this.directories.toArray();
    const allFiles = await this.files.toArray();
    const directories: Record<string, Directory> = {};
    const files: Record<string, File> = {};

    allDirectories.forEach(directory => {
      directories[String(directory.id)] = directory as unknown as Directory;
    });
    allFiles.forEach(file => {
      files[String(file.id)] = file as unknown as File;
    });
    Object.values(directories).forEach(directory => {
      directory.children = directory.children.map(c => directories[String(c)] || files[String(c)]);
      directory.parent = directories[String(directory.parent)];
    });
    Object.values(files).forEach(file => {
      file.parent = directories[String(file.parent)];
    });

    if (Object.keys(directories).length === 0) {
      await this.createDirectory(this.createDirectoryObject({ id: 'root', name: 'root' }));
      await this.createFile(this.createFileObject({ id: 'asyncapi', name: 'asyncapi' }));
    } else {
      this.mergeState({ directories, files });
    }
  }
}
