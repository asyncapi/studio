import { AbstractService } from './abstract.service';

import { Uri } from 'monaco-editor/esm/vs/editor/editor.api';
import { DiagnosticSeverity } from '@asyncapi/parser/cjs';
import { untilde } from '@asyncapi/parser/cjs/utils';
import resolvePath from '@einheit/path-resolve';

import { getReferenceKind } from './documents/reference-maps';
import { isDeepEqual, traverseObject } from '../helpers';
import { documentsState, settingsState } from '../state';

import type * as monacoAPI from 'monaco-editor/esm/vs/editor/editor.api';
import type { Diagnostic, SpecTypesV2, OldAsyncAPIDocument } from '@asyncapi/parser/cjs';
import type { DocumentsState, Document, DocumentComponentReference, DocumentDiagnostics } from '../state/documents.state';
import type { File } from '../state/files.state';

export class DocumentsService extends AbstractService {
  override async onInit() {
    this.subscribeToFiles();
    this.subscribeToSettings();
  }

  override async onAfterInit() {
    await this.handleSavedFiles();
  }

  addDocument(fileId: string, document: Partial<Document>): void {
    if (this.hasDocument(fileId)) {
      return this.updateDocument(fileId, document);
    }

    const newDocument = this.createDocumentObject(fileId, document);
    documentsState.setState(state => ({ documents: { ...state.documents, [String(fileId)]: newDocument } }));
    this.svcs.eventsSvc.emit('documents.document.create', newDocument);
  }
  
  updateDocument(fileId: string, document: Partial<Document>): void {
    const oldDocument = this.getDocument(fileId);
    if (!oldDocument) {
      return this.addDocument(fileId, document);
    }
  
    const updatedDocument = { ...oldDocument, ...document };
    documentsState.setState(state => ({ documents: { ...state.documents, [String(fileId)]: updatedDocument } }));
    this.svcs.eventsSvc.emit('documents.document.update', updatedDocument, oldDocument);
  }

  removeDocument(fileId: string) {
    const document = this.getDocument(fileId);
    if (!document) {
      return;
    }

    documentsState.setState(state => {
      const newDocuments = { ...state.documents };
      delete newDocuments[String(fileId)];
      return { documents: newDocuments };
    });
    this.svcs.eventsSvc.emit('documents.document.remove', document);
  }

  getReferenceKind(model: monacoAPI.editor.ITextModel, position: monacoAPI.Position) {
    return getReferenceKind(model, position);
  }

  getPossibleReferences(id: string, kind: keyof SpecTypesV2.ComponentsObject, fromDocument: boolean = true): Array<DocumentComponentReference> {
    const document = this.getDocument(id);
    if (!document) {
      return [];
    }
    const possibleRefs: Array<DocumentComponentReference> = [];

    // from this same document
    if (fromDocument) {
      const fromComponents = document.refs.fromComponents[kind];
      if (fromComponents) {
        possibleRefs.push(...fromComponents);
      }
    }

    // from sibling documents
    document.refs.siblingFiles.forEach(fileId => {
      const fromComponents = this.getDocument(fileId)?.refs?.fromComponents?.[kind];
      if (fromComponents) {
        fromComponents.forEach(ref => ({
          ...ref,
          path: ref.path, // TODO: fix relative path
        }));
      }
    });
    
    return possibleRefs;
  }

  getRangeForJsonPath(uri: string, jsonPath: string | Array<string | number>) {
    try {
      const { documents } = documentsState.getState();
      const extras = documents[String(uri)]?.extras;
      if (extras) {
        jsonPath = Array.isArray(jsonPath) ? jsonPath : jsonPath.split('/').map(untilde);
        if (jsonPath[0] === '') jsonPath.shift();
        return extras.document.getRangeForJsonPath(jsonPath, true);
      }
    } catch (err: any) {
      return;
    }
  }

  filterDiagnostics(diagnostics: Diagnostic[]) {
    const { governance: { show } } = settingsState.getState();
    return diagnostics.filter(({ severity }) => {
      return (
        severity === DiagnosticSeverity.Error ||
        (severity === DiagnosticSeverity.Warning && show.warnings) ||
        (severity === DiagnosticSeverity.Information && show.informations) ||
        (severity === DiagnosticSeverity.Hint && show.hints)
      );
    });
  }

  filterDiagnosticsBySeverity(diagnostics: Diagnostic[], severity: DiagnosticSeverity) {
    return diagnostics.filter(diagnostic => diagnostic.severity === severity);
  }

  getDocument(id: string): Document | undefined {
    return this.getState().documents[String(id)];
  }

  hasDocument(id: string) {
    return Boolean(this.getDocument(id));
  }

  getState() {
    return documentsState.getState();
  }

  setState(state: Partial<DocumentsState>) {
    return documentsState.setState(state);
  }

  async handleDocument(fileOrId: string | File): Promise<Document | undefined> {
    let file: File | undefined;
    if (typeof fileOrId === 'string') {
      file = this.svcs.filesSvc.getFile(fileOrId);
    } else {
      file = fileOrId;
    }

    if (!file) {
      return;
    }

    const { id, content, uri } = file;
    const parseResult = await this.svcs.parserSvc.parse(content, { source: uri });
    if (!parseResult) {
      const newDocument: Document = {
        filedId: id,
        document: null,
        diagnostics: this.serializeDiagnostics(),
        valid: false,
        refs: this.createDocumentRefs(''),
        extras: undefined,
      };
      this.updateDocument(file.id, newDocument);
      return newDocument;
    }

    const { document, diagnostics, extras } = parseResult;
    const serializedDiagnostics = this.serializeDiagnostics(diagnostics);
    const newDocument: Document = {
      filedId: id,
      document: document as OldAsyncAPIDocument || null,
      diagnostics: serializedDiagnostics,
      valid: serializedDiagnostics.errors.length === 0,
      refs: this.createDocumentRefs(file.uri, extras?.document?.data as SpecTypesV2.AsyncAPIObject),
      extras,
    };
    this.updateDocument(id, newDocument);
    return newDocument;
  }

  private serializeDiagnostics(diagnostics: Diagnostic[] = []) {
    // map messages of invalid ref to file
    diagnostics.forEach(diagnostic => {
      if (diagnostic.code === 'invalid-ref' && diagnostic.message.endsWith('readFile is not a function')) {
        diagnostic.message = 'Reference does not exist in a known contex.';
      }
    });

    const collections: DocumentDiagnostics = {
      original: diagnostics,
      filtered: [],
      errors: [],
      warnings: [],
      informations: [],
      hints: [],
    };

    const { governance: { show } } = settingsState.getState();
    diagnostics.forEach(diagnostic => {
      const severity = diagnostic.severity;
      if (severity === DiagnosticSeverity.Error) {
        collections.filtered.push(diagnostic);
        collections.errors.push(diagnostic);
      } else if (severity === DiagnosticSeverity.Warning && show.warnings) {
        collections.filtered.push(diagnostic);
        collections.warnings.push(diagnostic);
      } else if (severity === DiagnosticSeverity.Information && show.informations) {
        collections.filtered.push(diagnostic);
        collections.informations.push(diagnostic);
      } else if (severity === DiagnosticSeverity.Hint && show.hints) {
        collections.filtered.push(diagnostic);
        collections.hints.push(diagnostic);
      }
    });

    return collections;
  }

  private createDocumentRefs(fromUriPov: string, document?: SpecTypesV2.AsyncAPIObject): Document['refs'] {
    const refs: Document['refs'] = {
      fromComponents: {} as any,
      siblingFiles: [],
    }
    if (!document) {
      return refs;
    }

    refs.siblingFiles = this.findSiblingFiles(fromUriPov, document);
    const components = document?.components;
    if (components) {
      refs.fromComponents = this.getComponentReferences(components);
    }

    return refs;
  }

  private getComponentReferences(components: SpecTypesV2.ComponentsObject): Document['refs']['fromComponents'] {
    const refs: Document['refs']['fromComponents'] = {} as any;
    Object.entries(components).forEach(([kind, values]) => {
      refs[String(kind) as keyof SpecTypesV2.ComponentsObject] = Object.entries(values).map(([name, component]: [string, any]) => {
        return {
          path: `#/components/${kind}/${name}`,
          description: component?.description || component?.sumamry,
        }
      });
    });
    return refs;
  }

  private findSiblingFiles(fromUriPov: string, document: SpecTypesV2.AsyncAPIObject): Document['refs']['siblingFiles'] {
    const uri = Uri.parse(fromUriPov);
    const uriDirname = this.svcs.filesSvc.dirname(uri);
    const siblingFiles: Array<string> = [];
    traverseObject(document, (key, value) => {
      if (key === '$ref' && typeof value === 'string' && (value = value.trim())[0] !== '#') {
        const [file] = value.split('#');
        const resolvedPath = this.resolvePath(fromUriPov, file);
        const possibleFile = this.svcs.filesSvc.getFileByUri(resolvedPath);
        // console.log(possibleFile);
        if (possibleFile) {
          siblingFiles.push(possibleFile.id);
        }
      }
    });
    return siblingFiles;
  }

  private resolvePath(base: string, path: string) {
    const baseUri = Uri.parse(base);
    const baseSchema = baseUri.scheme;
    const pathUri = Uri.parse(path);
    const pathSchema = pathUri.scheme;

    // console.log(base, baseSchema, path, pathSchema, hasPathSchema);

    // with this same schema it's possibility to make the relative path
    if (baseSchema === pathSchema) {
      const baseDirname = this.svcs.filesSvc.dirname(baseUri);
      const pathPath = pathUri.path[0] === '/' ? pathUri.path.substring(1) : pathUri.path;
      return `${baseSchema}://${resolvePath(baseDirname, pathPath)}`;
    }

    // need to use absolute path
    return '';
  }

  private createDocumentObject(id: string, document: Partial<Document> = {}): Document {
    return {
      filedId: id,
      document: null,
      valid: false,
      extras: undefined,
      ...document,
      refs: document.refs || this.createDocumentRefs(''),
      diagnostics: document.diagnostics || this.serializeDiagnostics([]),
    }
  }

  private subscribeToFiles() {
    this.svcs.eventsSvc.on('fs.file.create', file => {
      this.handleDocument(file);
    });

    this.svcs.eventsSvc.on('fs.file.update', async file => {
      const document = await this.handleDocument(file);
      document?.refs.siblingFiles.forEach(async fileId => {
        await this.handleDocument(fileId);
      });
    });

    this.svcs.eventsSvc.on('fs.file.remove', file => {
      this.removeDocument(file.id);
    });
  }

  private handleSavedFiles() {
    const files = this.svcs.filesSvc.getFiles();  
    return Promise.all(
      Object.values(files).map(file => this.handleDocument(file))
    );
  }

  private subscribeToSettings() {
    this.svcs.eventsSvc.on('settings.update', (settings, prevSettings) => {
      if (isDeepEqual(settings.governance, prevSettings.governance)) {
        return;
      }

      const newDocuments = { ...this.getState().documents };
      Object.entries(newDocuments).forEach(([id, document]) => {
        if (document) {
          newDocuments[String(id)] = {
            ...document,
            diagnostics: this.serializeDiagnostics(document.diagnostics.original),
          }
        }
      });
      this.setState({ documents: newDocuments });
    });
  }
}
