import { generateUniqueID } from '../helpers';
import { sampleSpec } from '../state/editor';

export type FileID = string;
export enum FileExtension {
  JSON = 'JSON',
  YAML = 'YAML',
}
export interface File {
  id: FileID,
  name: string;
  extension: FileExtension;
  content: string;
  icon?: () => React.ReactNode;
}

const startupFiles = [
  {
    id: generateUniqueID(),
    name: 'asyncapi1',
    content: sampleSpec,
    extension: FileExtension.YAML,
  },
  {
    id: generateUniqueID(),
    name: 'asyncapi2',
    content: sampleSpec,
    extension: FileExtension.YAML,
  }
];

export class FilesManager {
  static files: Map<string, File> = new Map(startupFiles.map(file => [file.id, file]));
}
