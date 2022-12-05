import create from 'zustand';
import { persist } from 'zustand/middleware';

const schema =
  localStorage.getItem('document') || `asyncapi: '2.5.0'
info:
  title: Streetlights Kafka API
  version: '1.0.0'
  description: |
    The Smartylighting Streetlights API allows you to remotely manage the city lights.
    ### Check out its awesome features:
    * Turn a specific streetlight on/off 🌃
    * Dim a specific streetlight 😎
    * Receive real-time information about environmental lighting conditions 📈
  license:
    name: Apache 2.0
    url: https://www.apache.org/licenses/LICENSE-2.0
servers:
  test:
    url: test.mykafkacluster.org:8092
    protocol: kafka-secure
    description: Test broker
    security:
      - saslScram: []
defaultContentType: application/json
channels:
  smartylighting.streetlights.1.0.event.{streetlightId}.lighting.measured:
    description: The topic on which measured values may be produced and consumed.
    parameters:
      streetlightId:
        $ref: '#/components/parameters/streetlightId'
    publish:
      summary: Inform about environmental lighting conditions of a particular streetlight.
      operationId: receiveLightMeasurement
      traits:
        - $ref: '#/components/operationTraits/kafka'
      message:
        $ref: '#/components/messages/lightMeasured'
  smartylighting.streetlights.1.0.action.{streetlightId}.turn.on:
    parameters:
      streetlightId:
        $ref: '#/components/parameters/streetlightId'
    subscribe:
      operationId: turnOn
      traits:
        - $ref: '#/components/operationTraits/kafka'
      message:
        $ref: '#/components/messages/turnOnOff'
  smartylighting.streetlights.1.0.action.{streetlightId}.turn.off:
    parameters:
      streetlightId:
        $ref: '#/components/parameters/streetlightId'
    subscribe:
      operationId: turnOff
      traits:
        - $ref: '#/components/operationTraits/kafka'
      message:
        $ref: '#/components/messages/turnOnOff'
  smartylighting.streetlights.1.0.action.{streetlightId}.dim:
    parameters:
      streetlightId:
        $ref: '#/components/parameters/streetlightId'
    subscribe:
      operationId: dimLight
      traits:
        - $ref: '#/components/operationTraits/kafka'
      message:
        $ref: '#/components/messages/dimLight'
components:
  messages:
    lightMeasured:
      name: lightMeasured
      title: Light measured
      summary: Inform about environmental lighting conditions of a particular streetlight.
      contentType: application/json
      traits:
        - $ref: '#/components/messageTraits/commonHeaders'
      payload:
        $ref: "#/components/schemas/lightMeasuredPayload"
    turnOnOff:
      name: turnOnOff
      title: Turn on/off
      summary: Command a particular streetlight to turn the lights on or off.
      traits:
        - $ref: '#/components/messageTraits/commonHeaders'
      payload:
        $ref: "#/components/schemas/turnOnOffPayload"
    dimLight:
      name: dimLight
      title: Dim light
      summary: Command a particular streetlight to dim the lights.
      traits:
        - $ref: '#/components/messageTraits/commonHeaders'
      payload:
        $ref: "#/components/schemas/dimLightPayload"
  schemas:
    lightMeasuredPayload:
      type: object
      properties:
        lumens:
          type: integer
          minimum: 0
          description: Light intensity measured in lumens.
        sentAt:
          $ref: "#/components/schemas/sentAt"
    turnOnOffPayload:
      type: object
      properties:
        command:
          type: string
          enum:
            - on
            - off
          description: Whether to turn on or off the light.
        sentAt:
          $ref: "#/components/schemas/sentAt"
    dimLightPayload:
      type: object
      properties:
        percentage:
          type: integer
          description: Percentage to which the light should be dimmed to.
          minimum: 0
          maximum: 100
        sentAt:
          $ref: "#/components/schemas/sentAt"
    sentAt:
      type: string
      format: date-time
      description: Date and time when the message was sent.
  securitySchemes:
    saslScram:
      type: scramSha256
      description: Provide your username and password for SASL/SCRAM authentication
  parameters:
    streetlightId:
      description: The ID of the streetlight.
      schema:
        type: string
  messageTraits:
    commonHeaders:
      headers:
        type: object
        properties:
          my-app-header:
            type: integer
            minimum: 0
            maximum: 100
  operationTraits:
    kafka:
      bindings:
        kafka:
          clientId: my-app-id
`;

export interface FileStat {
  mtime: number;
}

export type Directory = {
  type: 'directory';
  uri: string;
  name: string;
  children: Array<Directory | File>;
  from: 'storage' | 'file-system';
  stat?: FileStat;
  parent?: Directory;
}

export type File = {
  type: 'file';
  uri: string;
  name: string;
  content: string;
  language: 'json' | 'yaml';
  modified: boolean;
  from: 'storage' | 'file-system' | 'url' | 'base64';
  source?: string;
  stat?: FileStat;
  parent?: Directory;
}

// TODO: Change to the File | undefined and Directory | undefined
export type FilesState = {
  files: Record<string, File>;
  directories: Record<string, Directory>;
}

// export type FilesActions = {
//   createDirectory: (uri: string, directory: Partial<Directory>) => void;
//   updateDirectory: (uri: string, directory: Partial<Directory>) => void;
//   removeDirectory: (uri: string) => void;
//   createFile: (uri: string, file: Partial<File>) => void;
//   updateFile: (uri: string, file: Partial<File>) => void;
//   removeFile: (uri: string) => void;
// }

const files: Record<string, File> = {
  'file:///file1': {
    type: 'file',
    uri: 'file:///file1',
    name: 'file1',
    content: schema,
    from: 'storage',
    source: undefined,
    language: schema.trimStart()[0] === '{' ? 'json' : 'yaml',
    modified: false,
    stat: {
      mtime: (new Date()).getTime(),
    }
  },
  'file:///file2': {
    type: 'file',
    uri: 'file:///file2',
    name: 'file2',
    content: 'lol: 1.2.0',
    from: 'storage',
    source: undefined,
    language: schema.trimStart()[0] === '{' ? 'json' : 'yaml',
    modified: false,
    stat: {
      mtime: (new Date()).getTime(),
    }
  },
  'file:///file3': {
    type: 'file',
    uri: 'file:///file3',
    name: 'file3',
    content: '',
    from: 'storage',
    source: undefined,
    language: schema.trimStart()[0] === '{' ? 'json' : 'yaml',
    modified: false,
    stat: {
      mtime: (new Date()).getTime(),
    }
  },
  'file:///asyncapi': {
    type: 'file',
    uri: 'file:///asyncapi',
    name: 'asyncapi',
    content: schema,
    from: 'storage',
    source: undefined,
    language: schema.trimStart()[0] === '{' ? 'json' : 'yaml',
    modified: false,
    stat: {
      mtime: (new Date()).getTime(),
    }
  },
}

const rootDirectory: Directory = {
  type: 'directory',
  uri: 'file:///root',
  name: 'root',
  children: [],
  from: 'storage',
}

const directories: Record<string, Directory> = {
  'file:///dir1': {
    type: 'directory',
    uri: 'file:///dir1',
    name: 'dir1',
    children: [files['file:///file3']],
    from: 'storage',
    parent: rootDirectory,
  },
  'file:///dir2': {
    type: 'directory',
    uri: 'file:///dir2',
    name: 'dir2',
    children: [files['file:///file2']],
    from: 'storage',
    parent: rootDirectory,
  }
}

files['file:///asyncapi'].parent = rootDirectory;
files['file:///file1'].parent = rootDirectory;
files['file:///file2'].parent = directories['file:///dir2'];
files['file:///file3'].parent = directories['file:///dir1'];
rootDirectory.children = [directories['file:///dir1'], directories['file:///dir2'], files['file:///asyncapi'], files['file:///file1']];

// function sortFunction(a: File | Directory, b: File | Directory) {
//   const isADirectory = a.type === 'directory';
//   const isBDirectory = b.type === 'directory';
//   // directories
//   if (isADirectory || isBDirectory) {
//     if (isADirectory && isBDirectory) {
//       if (a.name > b.name) return 1;
//       if (a.name < b.name) return -1;
//       return 0;
//     }
//     return isADirectory ? -1 : 1;
//   }
//   // files
//   if (a.name > b.name) return 1;
//   if (a.name < b.name) return -1;
//   return 0;
// }

// function sortChildren(children: Array<Directory | File>) {
//   return [...children].sort(sortFunction);
// }

// function addChildren(directory: Directory, children: Array<Directory | File>) {
//   return sortChildren([...directory.children, ...children]);
// }

// function mergeDirectories(state: FilesState, uri: string, oldDirectory: Directory, newDirectory: Partial<Directory>): Record<string, Directory> {
//   return { ...state.directories, [String(uri)]: { ...oldDirectory, ...newDirectory } };
// };

// function mergeFiles(state: FilesState, uri: string, oldFile: File, newFile: Partial<File>): Record<string, File> {
//   return { ...state.files, [String(uri)]: { ...oldFile, ...newFile } };
// };

// function createDirectoryObject(uri: string, directory: Partial<Directory>): Directory {
//   return {
//     type: 'directory',
//     uri,
//     name: directory.name || uri,
//     children: [],
//     from: 'storage',
//     stat: {
//       mtime: (new Date()).getTime(),
//       ...directory?.stat || {},
//     },
//     ...directory
//   }
// }

// function createFileObject(uri: string, file: Partial<File>): File {
//   return {
//     type: 'file',
//     uri,
//     name: file.name || uri,
//     content: '',
//     language: 'yaml',
//     from: file.from || 'storage',
//     parent: file.parent || rootDirectory,
//     modified: false,
//     stat: {
//       mtime: (new Date()).getTime(),
//       ...file?.stat || {},
//     },
//     ...file
//   }
// }

// function createFile(state: FilesState, uri: string, file: Partial<File>): Partial<FilesState> {
//   const newFile = createFileObject(uri, file);
//   const files = { ...state.files, [String(uri)]: newFile };
//   const parent = newFile.parent;
//   if (!parent) {
//     return { files };
//   }

//   const directories = { ...state.directories };
//   directories[String(parent.uri)] = { 
//     ...parent, 
//     children: addChildren(parent, [newFile]) 
//   };
//   return { files, directories };
// };

// function collectUris(children: Array<Directory | File>, collection: { files: Array<string>, directories: Array<string> } = { files: [], directories: [] }): { files: Array<string>, directories: Array<string> } {
//   children.forEach(c => {
//     if (c.type === 'file') {
//       collection.files.push(c.uri);
//       return;
//     }
//     collection.directories.push(c.uri);
//     return collectUris(c.children, collection);
//   });
//   return collection;
// }

// // TODO: handle overwriting
// function updateFile(state: FilesState, uri: string, file: Partial<File>): Partial<FilesState> {
//   const existingFile = state.files[String(uri)];
//   if (!existingFile) {
//     return createFile(state, uri, file as File)
//   }

//   const files = mergeFiles(state, uri, existingFile, file);
//   const parent = file.parent;
//   const existingParent = existingFile.parent;
//   if (!parent || (existingParent === parent)) {
//     return { files };
//   }

//   const directories = { ...state.directories };
//   // TODO: add root directory
//   if (existingParent) {
//     directories[String(existingParent.uri)] = { 
//       ...existingParent, 
//       children: existingParent.children.filter(c => !(c.uri === uri && c.type === 'file')),
//     }; 
//     directories[String(parent.uri)] = { 
//       ...parent, 
//       children: addChildren(parent, [file as File]),
//     };
//     return { files, directories };
//   } else {
//     // TODO
//   }

//   return state;
// };

// function removeFile(state: FilesState, uri: string): Partial<FilesState> {
//   const file = state.files[String(uri)];
//   if (!file) {
//     return state;
//   }

//   const files = { ...state.files };
//   delete files[String(uri)];

//   const parent = file.parent;
//   if (!parent) {
//     return { files };
//   }

//   const directories = { ...state.directories };
//   directories[String(parent.uri)] = { 
//     ...parent, 
//     children: parent.children.filter(c => !(c.uri === uri && c.type === 'file')),
//   }; 
//   return { files, directories };
// };

// function createDirectory(state: FilesState, uri: string, directory: Partial<Directory>): Partial<FilesState>  {
//   const newDirectory = createDirectoryObject(uri, directory);
//   const directories = { ...state.directories, [String(uri)]: newDirectory };
//   const parent = newDirectory.parent;
//   if (!parent) {
//     return { directories };
//   }

//   directories[String(parent.uri)] = { 
//     ...parent, 
//     children: addChildren(parent, [newDirectory]) 
//   };
//   return { directories };
// }

// // TODO: handle overwriting
// function updateDirectory(state: FilesState, uri: string, directory: Partial<Directory>): Partial<FilesState> {
//   const existingDirectory = state.directories[String(uri)];
//   if (!existingDirectory) {
//     return createDirectory(state, uri, directory as Directory);
//   }

//   const directories = mergeDirectories(state, uri, existingDirectory, directory);
//   const parent = directory.parent;
//   const existingParent = existingDirectory.parent;
//   if (!parent || (existingParent === parent)) {
//     return { directories };
//   }

//   // TODO: Add moving
//   return state;
// };

// function removeDirectory(state: FilesState, uri: string): Partial<FilesState> {
//   const directory = state.directories[String(uri)];
//   if (!directory) {
//     return state;
//   }

//   const directories = { ...state.directories };
//   delete directories[String(uri)];
//   const parent = directory.parent;
//   if (directory.children.length === 0) {
//     if (parent) {
//       directories[String(parent.uri)] = {
//         ...parent,
//         children: parent.children.filter(c => !(c.uri === uri && c.type === 'directory')),
//       }
//     }
//     return { directories };
//   }

//   let { files: filesUris, directories: directoriesUris } = collectUris(directory.children);
//   directoriesUris.forEach(uri => {
//     if (directories[String(uri)]) {
//       delete directories[String(uri)];
//     }
//   });
//   const files = { ...state.files };
//   filesUris.forEach(uri => {
//     if (files[String(uri)]) {
//       delete files[String(uri)];
//     }
//   });
//   if (parent) {
//     directories[String(parent.uri)] = {
//       ...parent,
//       children: parent.children.filter(c => !(c.uri === uri && c.type === 'directory')),
//     }
//   }

//   return { files, directories };
// };

export const filesState = create(
  persist<FilesState>(() => 
    ({
      files: files,
      directories: {
        'file:///root': rootDirectory,
        ...directories,
      },
    }), 
    {
      name: 'studio-files',
      getStorage: () => localStorage,
    }
  ),
);

export const useFilesState = filesState;