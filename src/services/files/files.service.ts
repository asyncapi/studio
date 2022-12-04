import { AbstractFilesService } from './abstract-files.service'

import { BrowserAPIFilesService } from './browser-api-files.service';
import { MemoryFilesService } from './memory-files.service';

import type { Services } from '../index';
import type { File, Directory } from '../../state/files.state';

export class FilesService extends AbstractFilesService {
  private readonly filesSvcs: {
    storage: MemoryFilesService,
    ['file-system']: BrowserAPIFilesService,
    [x: string]: AbstractFilesService;
  };

  constructor(services: Services) {
    super(services);
    this.filesSvcs = {
      storage: new MemoryFilesService(services),
      ['file-system']: new BrowserAPIFilesService(services),
    }
  }

  override async createDirectory(uri: string, directory: Partial<Directory>): Promise<void> {
    if (this.hasDirectory(uri)) {
      return this.updateDirectory(uri, directory);
    }

    let [newDirectory, directories] = this.mergeDirectories(uri, this.createDirectoryObject(uri, directory));
    await this.emitCreateDirectory(newDirectory);
    const parent = newDirectory.parent;
    if (!parent) {
      return this.setState({ directories });
    }
  
    const [newParent, newDirectories] = this.mergeDirectories(parent.uri, { children: this.addChildren(parent, [newDirectory]) });
    await this.emitCreateDirectory(newParent);
    return this.setState({ directories: newDirectories });
  }

  override async updateDirectory(uri: string, directory: Partial<Directory>): Promise<void> {
    const existingDirectory = this.getDirectory(uri);
    if (!existingDirectory) {
      return this.createDirectory(uri, directory);
    }

    const parent = directory.parent;
    const existingParent = existingDirectory.parent;
    const [newDirectory, directories] = this.mergeDirectories(uri, directory);
    await this.emitUpdateDirectory(newDirectory);
    if (!parent || (existingParent === parent)) {
      return this.setState({ directories });
    }
  
    // TODO: Add moving directories
    return this.setState({ directories });
  }

  override async removeDirectory(uri: string) {
    const directory = this.getDirectory(uri);
    if (!directory) {
      return;
    }
  
    let directories = { ...this.getDirectories() };
    delete directories[String(uri)];
    await this.emitRemoveDirectory(directory);

    const parent = directory.parent;
    if (directory.children.length === 0) {
      if (parent) {
        const [newParent, filteredDirectories] = this.mergeDirectories(parent.uri, { 
          children: parent.children.filter(c => !(c.uri === uri && c.type === 'directory')),
        });
        directories = { 
          ...directories, 
          ...filteredDirectories,
        };
        await this.emitUpdateDirectory(newParent);
      }
      return this.setState({ directories });
    }
  
    const files = { ...this.getFiles() };
    const children = this.collectChildren(directory.children);
    for (let child of children.reverse()) {
      if (child.type === 'directory') {
        const directory = directories[String(child.uri)];
        if (directory) {
          delete directories[String(child.uri)];
          await this.emitRemoveDirectory(directory);
        }
      } else {
        const file = files[String(child.uri)];
        if (file) {
          delete files[String(child.uri)];
          await this.emitRemoveFile(file);
        }
      }
    }

    if (parent) {
      const [newParent, filteredDirectories] = this.mergeDirectories(parent.uri, { 
        children: parent.children.filter(c => !(c.uri === uri && c.type === 'directory')),
      });
      directories = {
        ...directories, 
        ...filteredDirectories,
      };
      await this.emitUpdateDirectory(newParent);
    }
  
    return this.setState({ files, directories });
  }

  override async createFile(uri: string, file: Partial<File>): Promise<void> {
    if (this.hasFile(uri)) {
      return this.updateFile(uri, file);
    }

    const [newFile, files] = this.mergeFiles(uri, this.createFileObject(uri, file));
    await this.emitCreateFile(newFile);
    const parent = newFile.parent;
    if (!parent) {
      return this.setState({ files });
    }
  
    const [newParent, directories] = this.mergeDirectories(parent.uri, { 
      children: this.addChildren(parent, [newFile])
    });
    await this.emitUpdateDirectory(newParent);
    return this.setState({ files, directories });
  }

  override async updateFile(uri: string, file: Partial<File>): Promise<void> {
    const existingFile = this.getFile(uri);
    if (!existingFile) {
      return this.createFile(uri, file);
    }
  
    const parent = file.parent;
    const existingParent = existingFile.parent as Directory;
    const [newFile, files] = this.mergeFiles(uri, file);
    await this.emitUpdateFile(newFile);
    if (!parent || (existingParent === parent)) {
      return this.setState({ files });
    }
  
    // moving file - TODO: add removing previous file
    const [newExistingParent, existingDirs] = this.mergeDirectories(existingParent.uri, { children: existingParent.children.filter(c => !(c.uri === newFile.uri && c.type === 'file')), });
    const [newParent, parentDirs] = this.mergeDirectories(parent.uri, { children: this.addChildren(parent, [newFile]), });
    await this.emitUpdateDirectory(newExistingParent);
    await this.emitUpdateDirectory(newParent);
    return this.setState({ files, directories: { ...existingDirs, ...parentDirs } });
  }

  override async removeFile(uri: string): Promise<void> {
    const file = this.getFile(uri);
    if (!file) {
      return;
    }
  
    const files = { ...this.getFiles() };
    delete files[String(uri)];
    await this.emitRemoveFile(file);
  
    const parent = file.parent;
    if (!parent) {
      return this.setState({ files });
    }

    const [newParent, directories] = this.mergeDirectories(parent.uri, { 
      children: parent.children.filter(c => !(c.uri === uri && c.type === 'file'))
    });
    await this.emitUpdateDirectory(newParent);
    return this.setState({ files, directories });
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
    await this.filesSvcs[directory.from || 'storage']?.createDirectory(directory.uri, directory);
    this.svcs.eventsSvc.emit('fs.directory.create', directory);
  }

  private async emitUpdateDirectory(directory: Directory) {
    await this.filesSvcs[directory.from || 'storage']?.updateDirectory(directory.uri, directory);
    this.svcs.eventsSvc.emit('fs.directory.update', directory);
  }

  private async emitRemoveDirectory(directory: Directory) {
    await this.filesSvcs[directory.from || 'storage']?.removeDirectory(directory.uri);
    this.svcs.eventsSvc.emit('fs.directory.remove', directory);
  }

  private async emitCreateFile(file: File) {
    await this.filesSvcs[file.from || 'storage']?.createFile(file.uri, file);
    this.svcs.eventsSvc.emit('fs.file.create', file);
  }

  private async emitUpdateFile(file: File) {
    await this.filesSvcs[file.from || 'storage']?.updateFile(file.uri, file);
    this.svcs.eventsSvc.emit('fs.file.update', file);
  }

  private async emitRemoveFile(file: File) {
    await this.filesSvcs[file.from || 'storage']?.removeFile(file.uri);
    this.svcs.eventsSvc.emit('fs.file.remove', file);
  }
}
