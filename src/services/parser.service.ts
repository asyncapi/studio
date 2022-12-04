import { AbstractService } from './abstract.service';

import { Parser, convertToOldAPI, DiagnosticSeverity } from '@asyncapi/parser/cjs';
import { OpenAPISchemaParser } from '@asyncapi/parser/cjs/schema-parser/openapi-schema-parser';
import { AvroSchemaParser } from '@asyncapi/parser/cjs/schema-parser/avro-schema-parser';
import { untilde } from '@asyncapi/parser/cjs/utils';

import { filesState, documentsState, settingsState } from '../state';

import type { Diagnostic, ParseOptions } from '@asyncapi/parser/cjs';
import type { DocumentDiagnostics } from '../state/documents.state';

export class ParserService extends AbstractService {
  private parser: Parser = new Parser({
    schemaParsers: [
      OpenAPISchemaParser(),
      AvroSchemaParser(),
    ],
    __unstable: {
      resolver: {
        cache: false,
      }
    }
  });

  override async onInit() {
    this.subscribeToFiles();
    await this.parseSavedDocuments();
  }

  async parse(uri: string, spec: string, options: ParseOptions = {}): Promise<void> {
    if (uri !== 'asyncapi' && !options.source) {
      options.source = uri;
    }

    let diagnostics: Diagnostic[] = [];
    try {
      const { document, diagnostics: _diagnostics, extras } = await this.parser.parse(spec, options);
      diagnostics = _diagnostics;
  
      if (document) {
        const oldDocument = convertToOldAPI(document);
        return this.svcs.documentsSvc.updateDocument(uri, {
          document: oldDocument,
          diagnostics: this.createDiagnostics(diagnostics),
          extras,
          valid: true,
        });
      } 
    } catch (err: unknown) {
      console.log(err);
    }

    return this.svcs.documentsSvc.updateDocument(uri, {
      document: null,
      diagnostics: this.createDiagnostics(diagnostics),
      extras: undefined,
      valid: false,
    });
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

  private createDiagnostics(diagnostics: Diagnostic[]) {
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

  private subscribeToFiles() {
    this.svcs.eventsSvc.on('fs.file.create', file => {
      this.parse(file.uri, file.content, { source: file.source });
    });

    this.svcs.eventsSvc.on('fs.file.update', file => {
      this.parse(file.uri, file.content, { source: file.source });
    });
  }

  private parseSavedDocuments() {
    const { files } = filesState.getState();
    const promises = Object.entries(files)
      .map(([uri, file]) => {
        if (file) {
          return this.parse(uri, file.content);
        }
      })
      .filter(Boolean);

    return Promise.all(promises);
  }
}