import create from 'zustand';
import { persist } from 'zustand/middleware';

export const schema =
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

export enum FileFlags {
  NONE = 0,
  MODIFIED = 1,
  FROM_URL = 2,
  FROM_BASE64 = 4,
  EXOTIC = 8,
}

export type FileCore = {
  id: string;
  type: string;
  uri: string;
  name: string;
  from: 'in-memory' | 'file-system';
  flags: FileFlags
  stat?: FileStat;
  parent?: Directory;
}

export interface FileStat {
  mtime: number;
}

export type Directory = {
  type: 'directory';
  children: Array<Directory | File>;
} & FileCore;

export type File = {
  type: 'file';
  content: string;
  contentVersion: number;
  language: 'json' | 'yaml';
  source?: string;
} & FileCore;

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
  'file1': {
    id: 'file1',
    type: 'file',
    uri: 'file1',
    name: 'file1',
    content: schema,
    contentVersion: 0,
    from: 'in-memory',
    source: undefined,
    language: schema.trimStart()[0] === '{' ? 'json' : 'yaml',
    flags: FileFlags.NONE,
    stat: {
      mtime: (new Date()).getTime(),
    }
  },
  'file2': {
    id: 'file2',
    type: 'file',
    uri: 'file:///file2',
    name: 'file2',
    content: 'lol: 1.2.0',
    contentVersion: 0,
    from: 'in-memory',
    source: undefined,
    language: schema.trimStart()[0] === '{' ? 'json' : 'yaml',
    flags: FileFlags.NONE,
    stat: {
      mtime: (new Date()).getTime(),
    }
  },
  'file3': {
    id: 'file3',
    type: 'file',
    uri: 'file:///file3',
    name: 'file3',
    content: '',
    contentVersion: 0,
    from: 'in-memory',
    source: undefined,
    language: schema.trimStart()[0] === '{' ? 'json' : 'yaml',
    flags: FileFlags.NONE,
    stat: {
      mtime: (new Date()).getTime(),
    }
  },
  'asyncapi': {
    id: 'asyncapi',
    type: 'file',
    uri: 'file:///asyncapi',
    name: 'asyncapi',
    content: schema,
    contentVersion: 0,
    from: 'in-memory',
    source: undefined,
    language: schema.trimStart()[0] === '{' ? 'json' : 'yaml',
    flags: FileFlags.NONE,
    stat: {
      mtime: (new Date()).getTime(),
    }
  },
}

const rootDirectory: Directory = {
  id: 'root',
  type: 'directory',
  uri: 'file:///root',
  name: 'root',
  children: [],
  from: 'in-memory',
  flags: FileFlags.NONE,
}

const directories: Record<string, Directory> = {
  'dir1': {
    id: 'dir1',
    type: 'directory',
    uri: 'file:///dir1',
    name: 'dir1',
    children: [files['file3']],
    from: 'in-memory',
    flags: FileFlags.NONE,
    parent: rootDirectory,
  },
  'dir2': {
    id: 'dir2',
    type: 'directory',
    uri: 'file:///dir2',
    name: 'dir2',
    children: [files['file2']],
    from: 'in-memory',
    flags: FileFlags.NONE,
    parent: rootDirectory,
  }
}

files['asyncapi'].parent = rootDirectory;
files['file1'].parent = rootDirectory;
files['file2'].parent = directories['dir2'];
files['file3'].parent = directories['dir1'];
rootDirectory.children = [directories['dir1'], directories['dir2'], files['asyncapi'], files['file1']];

export const filesState = create<FilesState>(() => ({
  files: {},
  directories: {},
}));

  // () => ({
  //   files: files,
  //   directories: {
  //     'root': rootDirectory,
  //     ...directories,
  //   },
  // }),
  // persist<FilesState>(() => 
  //   ({
  //     files: files,
  //     directories: {
  //       'root': rootDirectory,
  //       ...directories,
  //     },
  //   }), 
  //   {
  //     name: 'studio-files',
  //     getStorage: () => localStorage,
  //   }
  // ),
// );

export const useFilesState = filesState;