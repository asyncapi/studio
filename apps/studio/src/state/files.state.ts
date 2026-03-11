import { create } from 'zustand';
import { DirectoryHandle, FileHandle } from '@/helpers/file-system-access.types';
import { debugLog } from '@/helpers/debug';

// Helper function to extract content and source from localStorage
const getDocumentFromLocalStorage = () => {
  if (typeof window === 'undefined') return { content: undefined, source: undefined };

  const stored = localStorage.getItem('document');
  if (!stored) return { content: undefined, source: undefined };

  try {
    // Try to parse as JSON (new format)
    const parsed = JSON.parse(stored);
    if (parsed && typeof parsed === 'object' && 'content' in parsed) {
      return {
        content: parsed.content,
        source: parsed.source || undefined,
      };
    }
  } catch {
    // If parsing fails, it's the old format (plain string)
    return { content: stored, source: undefined };
  }

  // Fallback to treating as plain string
  return { content: stored, source: undefined };
};

const { content: document, source: documentSource } = getDocumentFromLocalStorage();
const schema =
  document || `asyncapi: 3.0.0
info:
  title: Streetlights Kafka API
  version: 1.0.0
  description: |-
    The Smartylighting Streetlights API allows you to remotely manage the city
    lights.
    ### Check out its awesome features:

    * Turn a specific streetlight on/off 🌃  
    * Dim a specific streetlight 😎
    * Receive real-time information about environmental lighting conditions 📈
  license:
    name: Apache 2.0
    url: https://www.apache.org/licenses/LICENSE-2.0
defaultContentType: application/json
servers:
  scram-connections:
    host: test.mykafkacluster.org:18092
    protocol: kafka-secure
    description: Test broker secured with scramSha256
    security:
      - $ref: '#/components/securitySchemes/saslScram'
    tags:
      - name: env:test-scram
        description: >-
          This environment is meant for running internal tests through
          scramSha256
      - name: kind:remote
        description: This server is a remote server. Not exposed by the application
      - name: visibility:private
        description: This resource is private and only available to certain users
  mtls-connections:
    host: test.mykafkacluster.org:28092
    protocol: kafka-secure
    description: Test broker secured with X509
    security:
      - $ref: '#/components/securitySchemes/certs'
    tags:
      - name: env:test-mtls
        description: This environment is meant for running internal tests through mtls
      - name: kind:remote
        description: This server is a remote server. Not exposed by the application
      - name: visibility:private
        description: This resource is private and only available to certain users
channels:
  lightingMeasured:
    address: smartylighting.streetlights.1.0.event.{streetlightId}.lighting.measured
    messages:
      lightMeasured:
        $ref: '#/components/messages/lightMeasured'
    description: The topic on which measured values may be produced and consumed.
    parameters:
      streetlightId:
        $ref: '#/components/parameters/streetlightId'
  lightTurnOn:
    address: smartylighting.streetlights.1.0.action.{streetlightId}.turn.on
    messages:
      turnOn:
        $ref: '#/components/messages/turnOnOff'
    parameters:
      streetlightId:
        $ref: '#/components/parameters/streetlightId'
  lightTurnOff:
    address: smartylighting.streetlights.1.0.action.{streetlightId}.turn.off
    messages:
      turnOff:
        $ref: '#/components/messages/turnOnOff'
    parameters:
      streetlightId:
        $ref: '#/components/parameters/streetlightId'
  lightsDim:
    address: smartylighting.streetlights.1.0.action.{streetlightId}.dim
    messages:
      dimLight:
        $ref: '#/components/messages/dimLight'
    parameters:
      streetlightId:
        $ref: '#/components/parameters/streetlightId'
operations:
  receiveLightMeasurement:
    action: receive
    channel:
      $ref: '#/channels/lightingMeasured'
    summary: >-
      Inform about environmental lighting conditions of a particular
      streetlight.
    traits:
      - $ref: '#/components/operationTraits/kafka'
    messages:
      - $ref: '#/channels/lightingMeasured/messages/lightMeasured'
  turnOn:
    action: send
    channel:
      $ref: '#/channels/lightTurnOn'
    traits:
      - $ref: '#/components/operationTraits/kafka'
    messages:
      - $ref: '#/channels/lightTurnOn/messages/turnOn'
  turnOff:
    action: send
    channel:
      $ref: '#/channels/lightTurnOff'
    traits:
      - $ref: '#/components/operationTraits/kafka'
    messages:
      - $ref: '#/channels/lightTurnOff/messages/turnOff'
  dimLight:
    action: send
    channel:
      $ref: '#/channels/lightsDim'
    traits:
      - $ref: '#/components/operationTraits/kafka'
    messages:
      - $ref: '#/channels/lightsDim/messages/dimLight'
components:
  messages:
    lightMeasured:
      name: lightMeasured
      title: Light measured
      summary: >-
        Inform about environmental lighting conditions of a particular
        streetlight.
      contentType: application/json
      traits:
        - $ref: '#/components/messageTraits/commonHeaders'
      payload:
        $ref: '#/components/schemas/lightMeasuredPayload'
    turnOnOff:
      name: turnOnOff
      title: Turn on/off
      summary: Command a particular streetlight to turn the lights on or off.
      traits:
        - $ref: '#/components/messageTraits/commonHeaders'
      payload:
        $ref: '#/components/schemas/turnOnOffPayload'
    dimLight:
      name: dimLight
      title: Dim light
      summary: Command a particular streetlight to dim the lights.
      traits:
        - $ref: '#/components/messageTraits/commonHeaders'
      payload:
        $ref: '#/components/schemas/dimLightPayload'
  schemas:
    lightMeasuredPayload:
      type: object
      properties:
        lumens:
          type: integer
          minimum: 0
          description: Light intensity measured in lumens.
        sentAt:
          $ref: '#/components/schemas/sentAt'
    turnOnOffPayload:
      type: object
      properties:
        command:
          type: string
          enum:
            - 'on'
            - 'off'
          description: Whether to turn on or off the light.
        sentAt:
          $ref: '#/components/schemas/sentAt'
    dimLightPayload:
      type: object
      properties:
        percentage:
          type: integer
          description: Percentage to which the light should be dimmed to.
          minimum: 0
          maximum: 100
        sentAt:
          $ref: '#/components/schemas/sentAt'
    sentAt:
      type: string
      format: date-time
      description: Date and time when the message was sent.
  securitySchemes:
    saslScram:
      type: scramSha256
      description: Provide your username and password for SASL/SCRAM authentication
    certs:
      type: X509
      description: Download the certificate files from service provider
  parameters:
    streetlightId:
      description: The ID of the streetlight.
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
          clientId:
            type: string
            enum:
              - my-app-id
`;

export interface FileStat {
  mtime: number;
}

export type File = {
  uri: string;
  name: string;
  content: string;
  from: 'storage' | 'url' | 'base64' | 'share' | 'file';
  source?: string;
  language: 'json' | 'yaml' | 'markdown';
  modified: boolean;
  stat?: FileStat;
  fileHandle?: FileHandle;
  directoryHandle?: DirectoryHandle;
  localPath?: string;
  isAsyncApiDocument?: boolean;
}

export type FileTreeMode = 'none' | 'local' | 'remote';

export type FilesState = {
  files: Record<string, File>;
  activeFileUri: string;
  fileTreeMode: FileTreeMode;
  projectRoot?: string;
  fileTreeLoading: boolean;
}

export type FilesActions = {
  updateFile: (uri: string, file: Partial<File>) => void;
  setActiveFile: (uri: string) => void;
  setProjectFiles: (
    files: Record<string, File>,
    options?: {
      activeFileUri?: string;
      fileTreeMode?: FileTreeMode;
      projectRoot?: string;
    },
  ) => void;
  setFileTreeLoading: (loading: boolean) => void;
}

export const filesState = create<FilesState & FilesActions>((set, get) => ({
  files: {
    asyncapi: {
      uri: 'asyncapi',
      name: 'asyncapi',
      content: schema,
      from: 'storage',
      source: documentSource,
      language: schema.trimStart()[0] === '{' ? 'json' : 'yaml',
      modified: false,
      stat: {
        mtime: (new Date()).getTime(),
      }
    }
  },
  activeFileUri: 'asyncapi',
  fileTreeMode: 'none',
  projectRoot: undefined,
  fileTreeLoading: false,
  updateFile(uri: string, file: Partial<File>) {
    const before = get().files[String(uri)];
    const logBefore = before
      ? { from: before.from, source: before.source, localPath: before.localPath, hasDirectoryHandle: !!before.directoryHandle, hasFileHandle: !!before.fileHandle }
      : '(new file)';
    const logPatch = { from: file.from, source: file.source, localPath: file.localPath, hasDirectoryHandle: !!file.directoryHandle, hasFileHandle: !!file.fileHandle };
    debugLog('filesState', 'updateFile', uri, '\n  before:', logBefore, '\n  patch: ', logPatch);
    set((state) => {
      const nextFiles: Record<string, File> = {
        ...state.files,
        [String(uri)]: { ...state.files[String(uri)] || {}, ...file } as File,
      };
      if (String(uri) === 'asyncapi' && state.activeFileUri !== 'asyncapi' && nextFiles[state.activeFileUri]) {
        nextFiles[state.activeFileUri] = { ...nextFiles[state.activeFileUri], ...file, uri: state.activeFileUri };
      }
      if (String(uri) === state.activeFileUri && String(uri) !== 'asyncapi' && nextFiles.asyncapi) {
        nextFiles.asyncapi = { ...nextFiles.asyncapi, ...file, uri: state.activeFileUri };
      }
      return { files: nextFiles };
    });
    const after = get().files[String(uri)];
    const logAfter = { from: after.from, source: after.source, localPath: after.localPath, hasDirectoryHandle: !!after.directoryHandle, hasFileHandle: !!after.fileHandle };
    debugLog('filesState', 'updateFile', uri, '\n  after: ', logAfter);
  },
  setActiveFile(uri: string) {
    const selected = get().files[String(uri)];
    if (!selected) {
      return;
    }
    set((state) => ({
      activeFileUri: uri,
      files: {
        ...state.files,
        asyncapi: {
          ...state.files.asyncapi,
          ...selected,
          uri,
        },
      },
    }));
  },
  setProjectFiles(nextProjectFiles, options = {}) {
    const candidateActiveUri = options.activeFileUri || Object.keys(nextProjectFiles)[0] || 'asyncapi';
    const selected = nextProjectFiles[candidateActiveUri];
    const activeFileUri = selected ? candidateActiveUri : 'asyncapi';

    set((state) => ({
      files: {
        asyncapi: selected
          ? { ...state.files.asyncapi, ...selected, uri: activeFileUri }
          : state.files.asyncapi,
        ...nextProjectFiles,
      },
      activeFileUri,
      fileTreeMode: options.fileTreeMode ?? state.fileTreeMode,
      projectRoot: options.projectRoot ?? state.projectRoot,
      fileTreeLoading: false,
    }));
  },
  setFileTreeLoading(loading: boolean) {
    set({ fileTreeLoading: loading });
  },
}));

export const useFilesState = filesState;

