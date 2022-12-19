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
  private directories!: Table<TableDirectory>; 
  private files!: Table<TableFile>; 

  async onInit() {
    const database = new Dexie('in-memory-files');

    database.version(1).stores({
      directories: '&id, type, uri, name, from, flags, stat.mtime, parent, children',
      files: '&id, type, uri, name, from, flags, stat.mtime, parent, content, language, source',
    });

    this.directories = (database as any).directories;
    this.files = (database as any).files;

    await this.restoreFiles();
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

  override async updateFile(file: Partial<File>, options?: { saveContent: boolean }) {
    if (!file.id || !(await this.files.get(file.id))) {
      return;
    }

    try {
      const serializedFile = this.serializeFile(file);
      if (options?.saveContent !== true) {
        // don't save content to the storage
        delete serializedFile.content;
      }
      console.log(options);
      await this.files.update(file.id, serializedFile);
      await this.__updateFile(file);
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
    const file = await this.files.get(id);
    if (!file) {
      return;
    }

    try {
      file.content = content;
      await this.files.update(file.id, file);
    } catch(err) {
      console.error(err);
    }
  }

  private serializeDirectory(directory: Directory): TableDirectory;
  private serializeDirectory(directory: Partial<Directory>): Partial<TableDirectory>;
  private serializeDirectory(directory: Partial<Directory>): Partial<TableDirectory> {
    if (directory.parent) {
      return {
        ...directory,
        children: directory.children?.map(c => c.id) || [],
        parent: directory.parent?.id,
      }
    }
    return {
      ...directory,
      children: directory.children?.map(c => c.id) || [],
    } as Partial<TableDirectory>;
  }

  private serializeFile(file: File): TableFile;
  private serializeFile(file: Partial<File>): Partial<TableFile>;
  private serializeFile(file: Partial<File>): Partial<TableFile> {
    if (file.parent) {
      return {
        ...file,
        parent: file.parent?.id,
      }
    }
    return file as Partial<TableFile>;
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

  private async restoreFiles() {
    const allDirectories = await this.directories.toArray();
    const allFiles = await this.files.toArray();
    const directories: Record<string, Directory> = { ...this.getDirectories() };
    const files: Record<string, File> = { ...this.getFiles() };

    allDirectories.forEach(directory => {
      directory.children = [];
      directories[String(directory.id)] = directory as unknown as Directory;
    });
    allFiles.forEach(file => {
      files[String(file.id)] = file as unknown as File;
    });
    Object.values(directories).forEach(directory => {
      if (typeof directory.parent === 'string') {
        directory.parent = directories[String(directory.parent)];
        if (directory.parent) {
          directory.parent.children.push(directory);
        }
      }
    });
    Object.values(files).forEach(file => {
      if (typeof file.parent === 'string') {
        file.parent = directories[String(file.parent)];
        if (file.parent) {
          file.parent.children.push(file);
        }
      }
    });

    if (Object.keys(directories).length === 1 && Object.keys(files).length === 0) {
      await this.createFile(this.createFileObject({ id: 'asyncapi', name: 'asyncapi' }));
    } else {
      this.mergeState({ directories, files });
    }
  }
}
