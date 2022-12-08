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

  getDocument(fileId: string): Document | undefined {
    return this.getState().documents[String(fileId)];
  }

  hasDocument(fileId: string) {
    return Boolean(this.getDocument(fileId));
  }

  getState() {
    return documentsState.getState();
  }

  setState(state: Partial<DocumentsState>) {
    return documentsState.setState(state);
  }

  private createDocumentObject(filedId: string, document: Partial<Document> = {}): Document {
    return {
      filedId,
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
