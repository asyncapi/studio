import { generateUniqueID } from '../helpers';
import { sampleSpec, sampleSpec2 } from '../state/editor';

export type FileID = string;
export enum FileExtension {
  JSON = 'json',
  YAML = 'yaml',
  YML = 'yml',
}
export enum FileStatus {
  DEFAULT = 'DEFAULT',
  MODIFIED = 'MODIFIED',
  NEW = 'NEW',
}
export interface File {
  id: FileID,
  name: string;
  extension: FileExtension;
  content: string;
  status: FileStatus;
}

let fileIndex = 2;
export const startupFiles: File[] = [
  {
    id: generateUniqueID(),
    name: 'asyncapi1',
    content: sampleSpec,
    extension: FileExtension.YAML,
    status: FileStatus.DEFAULT,
  },
  {
    id: generateUniqueID(),
    name: 'asyncapi2',
    content: sampleSpec2,
    extension: FileExtension.YAML,
    status: FileStatus.DEFAULT,
  }
];

export class FilesManager {
  static files: Map<string, File> = new Map(startupFiles.map(file => [file.id, file]));
  private static filesListeners: Set<(files?: File[]) => void> = new Set();

  static getFile(id: FileID): File | undefined {
    return this.files.get(id);
  }

  static addFile(content?: string): void {
    const id = generateUniqueID();
    this.files.set(id, { id, name: `asyncapi${++fileIndex}`, content: content || sampleSpec2, extension: FileExtension.YAML, status: FileStatus.DEFAULT });
    this.updateFiles();
  }

  static deleteFile(id: FileID): void {
    this.files.delete(id);
    this.updateFiles();
  }

  static createFile(content: string) {
    const id = generateUniqueID();
    return { id, name: `asyncapi${++fileIndex}`, content, extension: FileExtension.YAML, status: FileStatus.DEFAULT };
  }

  static updateFileContent(id: FileID, content: string) {
    const file = this.getFile(id);
    if (!file) {
      return;
    }
    file.content = content;
  }

  static addFilesListener(listener: (files?: File[]) => void): (files?: File[]) => void {
    this.filesListeners.add(listener);
    this.updateFiles();
    return listener;
  }

  static removeFilesListener(listener: (files?: File[]) => void): void {
    this.filesListeners.delete(listener);
  }

  private static updateFiles() {
    const files = Array.from(this.files, ([_, panel]) => panel);
    this.filesListeners.forEach(listener => listener(files));
  }
}
