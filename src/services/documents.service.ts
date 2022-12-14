import { AbstractService } from './abstract.service';

import { DiagnosticSeverity } from '@asyncapi/parser/cjs';

import { isDeepEqual } from '../helpers';
import { documentsState, settingsState } from '../state';

import type { Diagnostic, SpecTypesV2 } from '@asyncapi/parser/cjs';
import type { DocumentsState, Document, DocumentDiagnostics } from '../state/documents.state';

type AutocompletionReferences = {
  path: string;
  description: string;
}

export class DocumentsService extends AbstractService {
  override onInit(): void {
    this.subscribeToFiles();
    this.subscribeToSettings();
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

  createDiagnostics(diagnostics: Diagnostic[]) {
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

  getPossibleRefs(id: string, fromUriPov: string): Record<keyof SpecTypesV2.ComponentsObject, Array<AutocompletionReferences>> | undefined {
    const document = this.getDocument(id);
    if (!document) {
      return;
    }

    const file = this.svcs.filesSvc.getFile(document.filedId);
    if (!file) {
      return;
    }

    const documentComponents = document.document?.components()?.json();
    if (!documentComponents) {
      return;
    }

    const refs: Record<string, Array<AutocompletionReferences>> = {}
    Object.entries(documentComponents).forEach(([kind, values]) => {
      refs[String(kind)] = Object.entries(values).map(([name, component]: [string, any]) => {
        return {
          path: `${file.uri}#/components/${kind}/${name}`,
          description: component.description || component.sumamry,
        }
      });
    });

    return refs as Record<keyof SpecTypesV2.ComponentsObject, Array<AutocompletionReferences>>;
  }

  getReferenceKind(path: string) {

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

  private createDocumentObject(id: string, document: Partial<Document> = {}): Document {
    return {
      filedId: id,
      document: null,
      valid: false,
      extras: undefined,
      ...document,
      diagnostics: document.diagnostics || this.createDiagnostics([]),
    }
  }

  private subscribeToFiles() {
    // this.svcs.eventsSvc.on('fs.file.update', (file) => {
    //   this.removeDocument(file.id);
    // });

    this.svcs.eventsSvc.on('fs.file.remove', file => {
      this.removeDocument(file.id);
    });
  }

  private subscribeToSettings() {
    this.svcs.eventsSvc.on('settings.update', (settings, prevSettings) => {
      if (isDeepEqual(settings.governance, prevSettings.governance)) {
        return;
      }

      const newDocuments = { ...this.getState().documents };
      Object.entries(newDocuments).forEach(([uri, document]) => {
        if (document) {
          newDocuments[String(uri)] = {
            ...document || {},
            diagnostics: this.createDiagnostics(document.diagnostics.original),
          }
        }
      });
      this.setState({ documents: newDocuments });
    });
  }
}
