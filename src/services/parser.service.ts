import { AbstractService } from './abstract.service';

import { Parser, convertToOldAPI, DiagnosticSeverity } from '@asyncapi/parser/cjs';
import { OpenAPISchemaParser } from '@asyncapi/parser/cjs/schema-parser/openapi-schema-parser';
import { AvroSchemaParser } from '@asyncapi/parser/cjs/schema-parser/avro-schema-parser';
import { untilde } from '@asyncapi/parser/cjs/utils';

import { isDeepEqual } from '../helpers';
import { filesState, documentsState, settingsState } from '../state/index.state';

import type { Diagnostic, ParseOptions } from '@asyncapi/parser/cjs';

export class ParserService extends AbstractService {
  private parser!: Parser;

  override async onInit() {
    this.parser = new Parser({
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

    this.subscribeToFiles();
    this.subscribeToSettings();
    this.parseSavedDocuments();
  }

  async parse(uri: string, spec: string, options: ParseOptions = {}): Promise<void> {
    if (!options.source) {
      options.source = uri;
    }

    const { updateDocument } = documentsState.getState();
    let diagnostics: Diagnostic[] = [];

    try {
      const { document, diagnostics: _diagnostics,  extras } = await this.parser.parse(spec, options);
      diagnostics = this.filterDiagnostics(_diagnostics);
  
      if (document) {
        const oldDocument = convertToOldAPI(document);
        updateDocument(uri, {
          uri,
          document: oldDocument,
          diagnostics,
          extras,
          valid: true,
        });
        return;
      } 
    } catch (err: unknown) {
      console.log(err);
      diagnostics = [];
    }

    updateDocument(uri, {
      uri,
      document: undefined,
      diagnostics,
      extras: undefined,
      valid: false,
    });
  }

  getRangeForJsonPath(uri: string, jsonPath: string | Array<string | number>) {
    try {
      const { documents } = documentsState.getState();
      const extras = documents[uri]?.extras;
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

  private subscribeToFiles() {
    filesState.subscribe((state, prevState) => {
      const newFiles = state.files;
      const oldFiles = prevState.files;

      Object.entries(newFiles).forEach(([uri, file]) => {
        const oldFile = oldFiles[uri];
        if (file === oldFile) return;
        this.parse(uri, file.content);
      });
    });
  }

  private subscribeToSettings() {
    settingsState.subscribe((state, prevState) => {
      if (isDeepEqual(state.governance, prevState.governance)) return;

      const { files } = filesState.getState();
      Object.entries(files).forEach(([uri, file]) => {
        this.parse(uri, file.content);
      });
    });
  }

  private parseSavedDocuments() {
    const { files } = filesState.getState();
    return Promise.all(
      Object.entries(files).map(([uri, file]) => {
        return this.parse(uri, file.content);
      }),
    );
  }
}