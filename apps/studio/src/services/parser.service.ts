import { AbstractService } from './abstract.service';

import { Parser, DiagnosticSeverity } from '@asyncapi/parser';
import { OpenAPISchemaParser } from '@asyncapi/openapi-schema-parser';
import { AvroSchemaParser } from '@asyncapi/avro-schema-parser';
import { ProtoBuffSchemaParser } from '@asyncapi/protobuf-schema-parser';
import { untilde } from '@asyncapi/parser/cjs/utils';

import { isDeepEqual } from '@/helpers';
import { filesState, documentsState, settingsState } from '@/state';
import { createLocalFileResolver } from './local-file-resolver';

import type { Diagnostic, ParseOptions } from '@asyncapi/parser';
import type { DocumentDiagnostics } from '@/state/documents.state';
import type { SchemaParser } from '@asyncapi/parser';
import { getLocationForJsonPath, parseWithPointers } from '@stoplight/yaml';

export class ParserService extends AbstractService {
  private parser!: Parser;
  private unsubscribeFiles?: () => void;
  private unsubscribeSettings?: () => void;

  override async onInit() {
    this.parser = new Parser({
      schemaParsers: [
        // Temporary fix for TS error
        OpenAPISchemaParser() as SchemaParser<unknown, unknown>,
        AvroSchemaParser() as SchemaParser<unknown, unknown>,
        ProtoBuffSchemaParser() as SchemaParser<unknown, unknown>,
      ],
      __unstable: {
        resolver: {
          cache: false,
        }
      }
    });

    this.subscribeToFiles();
    this.subscribeToSettings();
    await this.parseSavedDocuments();
  }

  destroy() {
    // Clean up subscriptions when service is destroyed
    this.unsubscribeFiles?.();
    this.unsubscribeSettings?.();
  }

  async parse(uri: string, spec: string, options: ParseOptions = {}): Promise<void> {
    if (uri !== 'asyncapi' && !options.source) {
      options.source = uri;
    }

    // Inject local file resolver when the file was opened from local disk with folder access
    const file = filesState.getState().files[String(uri)];
    const useLocalResolver = !!(file?.from === 'file' && file.directoryHandle && file.localPath);
    console.log(
      '[DEBUG:parser] parse()', uri,
      '\n  file.from:', file?.from,
      '\n  file.source:', file?.source,
      '\n  file.localPath:', file?.localPath,
      '\n  hasDirectoryHandle:', !!file?.directoryHandle,
      '\n  options.source:', options.source,
      '\n  → resolver:', useLocalResolver ? 'LOCAL FILE RESOLVER' : 'default (remote/HTTP)',
    );
    if (useLocalResolver && file.directoryHandle && file.localPath) {
      const resolver = createLocalFileResolver({
        directoryHandle: file.directoryHandle,
        basePath: file.localPath,
      });
      (options as any).__unstable = {
        resolver: {
          resolvers: [resolver],
        },
      };
    }

    let diagnostics: Diagnostic[] = [];
    try {
      const { document, diagnostics: _diagnostics, extras } = await this.parser.parse(spec, options);
      diagnostics = _diagnostics;
      if (document) {
        this.updateDocument(uri, {
          uri,
          document,
          diagnostics: this.createDiagnostics(diagnostics),
          extras,
          valid: true,
        });
        return;
      } 
    } catch (err: unknown) {
      console.log(err);
    }

    this.updateDocument(uri, {
      uri,
      document: undefined,
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

        return extras.document.getRangeForJsonPath(jsonPath);
      }
    } catch (err) {
      console.error(err);
    }
  }

  getRangeForYamlPath(uri: string, jsonPath: string | Array<string | number>) {
    try {
      const { documents } = documentsState.getState();

      const extras = documents[String(uri)]?.extras;

      if (extras) {
        jsonPath = Array.isArray(jsonPath) ? jsonPath : jsonPath.split('/').map(untilde);
        if (jsonPath[0] === '') jsonPath.shift();
        const yamlDoc = parseWithPointers(this.svcs.editorSvc.value);

        const location = getLocationForJsonPath(yamlDoc, jsonPath, true);
        return location?.range || { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } };
      }
    } catch (err) {
      console.error(err);
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

  private updateDocument = documentsState.getState().updateDocument;

  private createDiagnostics(diagnostics: Diagnostic[]) {
    // Map unresolvable local file ref errors to a clear, actionable message
    diagnostics.forEach(diagnostic => {
      if (
        diagnostic.code === 'invalid-ref' &&
        (diagnostic.message.endsWith('readFile is not a function') ||
          diagnostic.message.includes('File references are not yet supported'))
      ) {
        diagnostic.message =
          'Local file reference detected. Click Import → Grant Folder Access to resolve this reference.';
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

  private subscribeToFiles() {
    // Unsubscribe from previous subscription if it exists
    if (this.unsubscribeFiles) {
      console.log('[DEBUG:parser] subscribeToFiles - cleaning up previous subscription');
      this.unsubscribeFiles();
    }

    this.unsubscribeFiles = filesState.subscribe((state, prevState) => {
      const newFiles = state.files;
      const oldFiles = prevState.files;

      Object.entries(newFiles).forEach(([uri, file]) => {
        const oldFile = oldFiles[String(uri)];
        if (file === oldFile) return;

        // Skip cosmetic-only changes (from, modified, language, name).
        // Re-parse only when content, resolver configuration, or the explicit
        // freshness timestamp (stat.mtime) changed.
        const contentChanged = file.content !== oldFile?.content;
        const sourceChanged = file.source !== oldFile?.source;
        const directoryHandleChanged = file.directoryHandle !== oldFile?.directoryHandle;
        const localPathChanged = file.localPath !== oldFile?.localPath;
        const mtimeChanged = file.stat?.mtime !== oldFile?.stat?.mtime;

        console.log('[DEBUG:parser] subscribeToFiles', uri, { contentChanged, sourceChanged, directoryHandleChanged, localPathChanged, mtimeChanged });

        if (!contentChanged && !sourceChanged && !directoryHandleChanged && !localPathChanged && !mtimeChanged) {
          return;
        }

        this.parse(uri, file.content, { source: file.source }).catch(console.error);
      });
    });
  }

  private subscribeToSettings() {
    // Unsubscribe from previous subscription if it exists
    if (this.unsubscribeSettings) {
      console.log('[DEBUG:parser] subscribeToSettings - cleaning up previous subscription');
      this.unsubscribeSettings();
    }

    this.unsubscribeSettings = settingsState.subscribe((state, prevState) => {
      if (isDeepEqual(state.governance, prevState.governance)) return;

      const { files } = filesState.getState();
      Object.entries(files).forEach(([uri, file]) => {
        this.parse(uri, file.content).catch(console.error);
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
