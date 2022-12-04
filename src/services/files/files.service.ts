import { AbstractFilesService } from './abstract-files.service'

import { BrowserAPIFilesService } from './browser-api-files.service';
import { MemoryFilesService } from './memory-files.service';

import { filesState } from '../../state';

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
    await this.filesSvcs[directory.from || 'storage']?.createDirectory(uri, directory);
    filesState.getState().createDirectory(uri, directory);
    this.svcs.eventsSvc.emit('fs.directory.create', directory as Directory);
  }

  override async updateDirectory(uri: string, directory: Partial<Directory>): Promise<void> {
    if (directory.from) {
      await this.filesSvcs[directory.from]?.updateDirectory(uri, directory);
      filesState.getState().updateDirectory(uri, directory);
      this.svcs.eventsSvc.emit('fs.directory.update', directory as Directory);
    }
  }

  override async removeDirectory(uri: string): Promise<void> {
    const directory = this.getDirectory(uri);
    if (directory) {
      await this.filesSvcs[directory.from]?.removeDirectory(uri);
      filesState.getState().removeDirectory(uri);
      this.svcs.eventsSvc.emit('fs.directory.remove', directory);
    }
  }

  override async createFile(uri: string, file: Partial<File>): Promise<void> {
    await this.filesSvcs[file.from || 'storage']?.createFile(uri, file);
    filesState.getState().createFile(uri, file);
    this.svcs.eventsSvc.emit('fs.file.create', file as File);
  }

  override async updateFile(uri: string, file: Partial<File>): Promise<void> {
    if (file.from) {
      await this.filesSvcs[file.from]?.updateFile(uri, file);
      filesState.getState().updateFile(uri, file);
      this.svcs.eventsSvc.emit('fs.file.update', file as File);
    }
  }

  override async removeFile(uri: string): Promise<void> {
    const file = this.getFile(uri);
    if (file) {
      await this.filesSvcs[file.from]?.removeFile(uri);
      filesState.getState().removeFile(uri);
      this.svcs.eventsSvc.emit('fs.file.remove', file);
    }
  }
}
