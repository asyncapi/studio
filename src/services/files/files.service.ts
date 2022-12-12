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

  override async onInit() {
    this.getRootDirectory();
    await this.filesSvcs['in-memory'].onInit();
    await this.filesSvcs['file-system'].onInit();
    this.sortAllDirectories();
  }

  override async onAfterInit() {    
    await this.filesSvcs['in-memory'].onAfterInit();
    await this.filesSvcs['file-system'].onAfterInit();
  }

  override async onAfterAppInit() {    
    await this.filesSvcs['in-memory'].onAfterAppInit();
    await this.filesSvcs['file-system'].onAfterAppInit();
  }

  async openDirectory() {
    await this.filesSvcs['file-system'].openDirectory();
    this.sortAllDirectories();
  }

  isSupportedBrowserAPI() {
    return this.filesSvcs['file-system'].isSupportedBrowserAPI();
  }

  hasSavedBrowserAPIDirectories() {
    return this.filesSvcs['file-system'].hasSavedBrowserAPIDirectories();
  }

  restoreBrowserAPIDirectories() {
    return this.filesSvcs['file-system'].restoreDirectories();
  }

  override async createDirectory(directory: Partial<Directory>) {
    if (directory.id && this.hasDirectory(directory.id)) {
      return;
    }
    const newDirectory = this.createDirectoryObject(directory);
    return this.filesSvcs[newDirectory.from || 'in-memory']?.createDirectory(newDirectory);
  }

  override async updateDirectory(directory: Partial<Directory>) {
    if (directory.id && this.hasDirectory(directory.id)) {
      return this.filesSvcs[directory.from || 'in-memory']?.updateDirectory(directory);
    }
  }

  override async removeDirectory(id: string) {
    const directory = this.getDirectory(id);
    if (directory) {
      return this.filesSvcs[directory.from || 'in-memory']?.removeDirectory(id);
    }
  }

  override async createFile(file: Partial<File>) {
    if (file.id && this.hasFile(file.id)) {
      return;
    }
    const newFile = this.createFileObject(file);
    return this.filesSvcs[newFile.from || 'in-memory']?.createFile(newFile);
  }

  override async updateFile(file: Partial<File>) {
    if (file.id && this.hasFile(file.id)) {
      return this.filesSvcs[file.from || 'in-memory']?.updateFile(file);
    }
  }

  override async removeFile(id: string) {
    const file = this.getFile(id);
    if (file) {
      return this.filesSvcs[file.from || 'in-memory']?.removeFile(id);
    }
  }

  override async getFileContent(id: string) {
    const file = this.getFile(id);
    if (file) {
      return this.filesSvcs[file.from || 'in-memory']?.getFileContent(id);
    }
  }

  override async saveFileContent(id: string, content: string) {
    const file = this.getFile(id);
    if (file) {
      return this.filesSvcs[file.from || 'in-memory']?.saveFileContent(id, content);
    }
  }

  private sortAllDirectories() {
    const directories: Record<string, Directory> = {};
    Object.values(this.getDirectories()).forEach(directory => {
      directories[String(directory.id)] = {
        ...directory,
        children: this.sortChildren(directory.children),
      }
    });
    this.setState({ directories });
  }
}
