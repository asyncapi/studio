import { AbstractFilesService } from './abstract-files.service';

import type { File, Directory } from '../../state/files.state';

export class BrowserAPIFilesService extends AbstractFilesService {
  override createDirectory(uri: string, directory: Partial<Directory>): void | Promise<void> {
    
  }

  override updateDirectory(uri: string, directory: Partial<Directory>): void | Promise<void> {
    
  }

  override removeDirectory(uri: string): void | Promise<void> {
    
  }

  override createFile(uri: string, file: Partial<File>): void | Promise<void> {
    
  }

  override updateFile(uri: string, file: Partial<File>): void | Promise<void> {
    
  }

  override removeFile(uri: string): void | Promise<void> {
    
  }
}
