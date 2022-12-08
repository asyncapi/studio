import { AbstractFilesService } from './abstract-files.service'

import { BrowserAPIFilesService } from './browser-api-files.service';
import { MemoryFilesService } from './memory-files.service';

import type { Services } from '../index';
import type { File, Directory } from '../../state/files.state';

export class FilesService extends AbstractFilesService {
  private readonly filesSvcs: {
    ['in-memory']: MemoryFilesService,
    ['file-system']: BrowserAPIFilesService,
    [x: string]: AbstractFilesService;
  };

  constructor(services: Services) {
    super(services);
    this.filesSvcs = {
      ['in-memory']: new MemoryFilesService(services),
      ['file-system']: new BrowserAPIFilesService(services),
    }
  }

  async onInit() {
    await this.filesSvcs['in-memory'].onInit();
    await this.filesSvcs['file-system'].onInit();
  }

  override async createDirectory(id: string, directory: Partial<Directory>): Promise<void> {
    if (this.hasDirectory(id)) {
      return this.updateDirectory(id, directory);
    }

    let [newDirectory, directories] = this.mergeDirectories(id, this.createDirectoryObject(id, directory));
    await this.emitCreateDirectory(newDirectory);
    const parent = newDirectory.parent;
    if (!parent) {
      return this.setState({ directories });
    }
  
    const [newParent, newDirectories] = this.mergeDirectories(parent.id, { children: this.addChildren(parent, [newDirectory]) });
    await this.emitCreateDirectory(newParent);
    return this.setState({ directories: newDirectories });
  }

  override async updateDirectory(id: string, directory: Partial<Directory>): Promise<void> {
    const existingDirectory = this.getDirectory(id);
    if (!existingDirectory) {
      return this.createDirectory(id, directory);
    }

    const parent = directory.parent;
    const existingParent = existingDirectory.parent;
    const [newDirectory, directories] = this.mergeDirectories(id, directory);
    await this.emitUpdateDirectory(newDirectory, existingDirectory);
    if (!parent || (existingParent === parent)) {
      return this.setState({ directories });
    }
  
    // TODO: Add moving directories
    return this.setState({ directories });
  }

  override async removeDirectory(id: string) {
    const directory = this.getDirectory(id);
    if (!directory) {
      return;
    }
  
    let directories = { ...this.getDirectories() };
    await this.emitRemoveDirectory(directory);
    delete directories[String(id)];

    const parent = directory.parent;
    if (directory.children.length === 0) {
      if (parent) {
        const [newParent, filteredDirectories] = this.mergeDirectories(parent.id, { 
          children: parent.children.filter(c => !(c.id === id && c.type === 'directory')),
        });
        directories = { 
          ...directories, 
          ...filteredDirectories,
        };
        await this.emitUpdateDirectory(newParent, parent);
      }
      return this.setState({ directories });
    }
  
    const files = { ...this.getFiles() };
    const children = this.collectChildren(directory.children);
    for (let child of children.reverse()) {
      if (child.type === 'directory') {
        const directory = directories[String(child.id)];
        if (directory) {
          await this.emitRemoveDirectory(directory);
          delete directories[String(child.id)];
        }
      } else {
        const file = files[String(child.id)];
        if (file) {
          await this.emitRemoveFile(file);
          delete files[String(child.id)];
        }
      }
    }

    if (parent) {
      const [newParent, filteredDirectories] = this.mergeDirectories(parent.id, { 
        children: parent.children.filter(c => !(c.id === id && c.type === 'directory')),
      });
      directories = {
        ...directories, 
        ...filteredDirectories,
      };
      await this.emitUpdateDirectory(newParent, parent);
    }
  
    return this.setState({ files, directories });
  }

  override async createFile(id: string, file: Partial<File>): Promise<void> {
    if (this.hasFile(id)) {
      return this.updateFile(id, file);
    }

    const [newFile, files] = this.mergeFiles(id, this.createFileObject(id, file));
    await this.emitCreateFile(newFile);
    const parent = newFile.parent;
    if (!parent) {
      return this.setState({ files });
    }
  
    const [newParent, directories] = this.mergeDirectories(parent.id, { 
      children: this.addChildren(parent, [newFile])
    });
    await this.emitUpdateDirectory(newParent, parent);
    return this.setState({ files, directories });
  }

  override async updateFile(id: string, file: Partial<File>): Promise<void> {
    const existingFile = this.getFile(id);
    if (!existingFile) {
      return this.createFile(id, file);
    }
  
    const parent = file.parent;
    const existingParent = existingFile.parent as Directory;
    const [newFile, files] = this.mergeFiles(id, file);
    await this.emitUpdateFile(newFile, existingFile);
    if (!parent || (existingParent === parent)) {
      return this.setState({ files });
    }
  
    // moving file - TODO: add removing previous file
    const [newExistingParent, existingDirs] = this.mergeDirectories(existingParent.id, { children: existingParent.children.filter(c => !(c.id === newFile.id && c.type === 'file')), });
    const [newParent, parentDirs] = this.mergeDirectories(parent.id, { children: this.addChildren(parent, [newFile]), });
    await this.emitUpdateDirectory(newExistingParent, existingParent);
    await this.emitUpdateDirectory(newParent, parent);
    return this.setState({ files, directories: { ...existingDirs, ...parentDirs } });
  }

  override async removeFile(id: string): Promise<void> {
    const file = this.getFile(id);
    if (!file) {
      return;
    }
  
    const files = { ...this.getFiles() };
    await this.emitRemoveFile(file);
    delete files[String(id)];
  
    const parent = file.parent;
    if (!parent) {
      return this.setState({ files });
    }

    const [newParent, directories] = this.mergeDirectories(parent.id, { 
      children: parent.children.filter(c => !(c.id === id && c.type === 'file'))
    });
    await this.emitUpdateDirectory(newParent, parent);
    return this.setState({ files, directories });
  }

  override async getFileContent(fileId: string): Promise<string | undefined> {
    const file = this.getFile(fileId);
    if (file) {
      return await this.filesSvcs[file.from || 'in-memory']?.getFileContent(fileId);
    }
  }

  override async saveFileContent(fileId: string, content: string): Promise<void> {
    const file = this.getFile(fileId);
    if (!file) {
      return;
    }
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

  private async emitCreateDirectory(directory: Directory) {
    await this.filesSvcs[directory.from || 'in-memory']?.createDirectory(directory.id, directory);
    this.svcs.eventsSvc.emit('fs.directory.create', directory);
  }

  private async emitUpdateDirectory(directory: Directory, prevDirectory: Directory) {
    await this.filesSvcs[directory.from || 'in-memory']?.updateDirectory(directory.id, directory);
    this.svcs.eventsSvc.emit('fs.directory.update', directory, prevDirectory);
  }

  private async emitRemoveDirectory(directory: Directory) {
    await this.filesSvcs[directory.from || 'in-memory']?.removeDirectory(directory.id);
    this.svcs.eventsSvc.emit('fs.directory.remove', directory);
  }

  private async emitCreateFile(file: File) {
    await this.filesSvcs[file.from || 'in-memory']?.createFile(file.id, file);
    this.svcs.eventsSvc.emit('fs.file.create', file);
  }

  private async emitUpdateFile(file: File, prevFile: File) {
    await this.filesSvcs[file.from || 'in-memory']?.updateFile(file.id, file);
    this.svcs.eventsSvc.emit('fs.file.update', file, prevFile);
  }

  private async emitRemoveFile(file: File) {
    await this.filesSvcs[file.from || 'in-memory']?.removeFile(file.id);
    this.svcs.eventsSvc.emit('fs.file.remove', file);
  }
}
