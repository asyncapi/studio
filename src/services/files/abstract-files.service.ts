import { AbstractService } from '../abstract.service';
import { Uri } from 'monaco-editor/esm/vs/editor/editor.api';

import { filesState } from '../../state';

import type { File, Directory } from '../../state/files.state';

export abstract class AbstractFilesService extends AbstractService {
  abstract createDirectory(uri: string, directory: Partial<Directory>): void | Promise<void>;
  abstract updateDirectory(uri: string, directory: Partial<Directory>): void | Promise<void>;
  abstract removeDirectory(uri: string): void | Promise<void>;

  abstract createFile(uri: string, file: Partial<File>): void | Promise<void>;
  abstract updateFile(uri: string, file: Partial<File>): void | Promise<void>;
  abstract removeFile(uri: string): void | Promise<void>;

  // abstract getDirectory(uri: string): Directory | undefined | Promise<Directory | undefined>;

  // abstract getFile(uri: string): File | undefined | Promise<File | undefined>;
  // abstract readFile(uri: string): File | Promise<string>;

  // abstract rename(oldUri: string, newUri: string, options: { overwrite: boolean }): void | Promise<void>;

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

  getDirectory(uri: string): Directory | undefined {
    return filesState.getState().directories[String(uri)];
  }

  getFile(uri: string): File | undefined {
    return filesState.getState().files[String(uri)];
  }

  getRootDirectory(): Directory {
    return this.getDirectory('root') as Directory;
  }

  absolutePath(item: File | Directory): string {
    if (item.parent && item.parent.uri !== 'root') {
      return `${this.absolutePath(item.parent)}/${item.name}`;
    }
    return item.name;
  }
}