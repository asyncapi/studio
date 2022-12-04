import { AbstractService } from './abstract.service';

import { DiagnosticSeverity } from '@asyncapi/parser/cjs';

import { isDeepEqual } from '../helpers';
import { documentsState, settingsState } from '../state';

import type { Diagnostic } from '@asyncapi/parser/cjs';
import type { DocumentsState, Document, DocumentDiagnostics } from '../state/documents.state';

export class DocumentsService extends AbstractService {
  override onInit(): void {
    this.subscribeToFiles();
    this.subscribeToSettings();
  }

  addDocument(uri: string, document: Partial<Document>): void {
    if (this.hasDocument(uri)) {
      return this.updateDocument(uri, document);
    }

    const newDocument = this.createDocumentObject(uri, document);
    documentsState.setState(state => ({ documents: { ...state.documents, [String(uri)]: newDocument } }));
    this.svcs.eventsSvc.emit('documents.document.create', newDocument);
  }
  
  updateDocument(uri: string, document: Partial<Document>): void {
    const oldDocument = this.getDocument(uri);
    if (!oldDocument) {
      return this.addDocument(uri, document);
    }
  
    const updatedDocument = { ...oldDocument, ...document };
    documentsState.setState(state => ({ documents: { ...state.documents, [String(uri)]: updatedDocument } }));
    this.svcs.eventsSvc.emit('documents.document.update', updatedDocument);
  }

  removeDocument(uri: string) {
    const document = this.getDocument(uri);
    if (!document) {
      return;
    }

    documentsState.setState(state => {
      const newDocuments = { ...state.documents };
      delete newDocuments[String(uri)];
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

  getDocument(uri: string): Document | undefined {
    return this.getState().documents[String(uri)];
  }

  hasDocument(uri: string) {
    return Boolean(this.getDocument(uri));
  }

  getState() {
    return documentsState.getState();
  }

  setState(state: Partial<DocumentsState>) {
    return documentsState.setState(state);
  }

  private createDocumentObject(uri: string, document: Partial<Document> = {}): Document {
    return {
      uri,
      document: null,
      valid: false,
      extras: undefined,
      ...document,
      diagnostics: document.diagnostics 
        ? document.diagnostics 
        : this.createDiagnostics([]),
    }
  }

  private subscribeToFiles() {
    this.svcs.eventsSvc.on('fs.file.remove', file => {
      this.removeDocument(file.uri);
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
