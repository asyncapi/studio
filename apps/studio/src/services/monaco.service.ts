import { AbstractService } from './abstract.service';

import { loader } from '@monaco-editor/react';
import { setDiagnosticsOptions } from 'monaco-yaml';
import YAML from 'js-yaml';
import avroSchema from '@/schemas/avro/avro-schema.json';

import { documentsState, filesState } from '@/state';

import type * as monacoAPI from 'monaco-editor/esm/vs/editor/editor.api';
import type { DiagnosticsOptions as YAMLDiagnosticsOptions } from 'monaco-yaml';
import type { SpecVersions } from '../types';
import type { JSONSchema7 } from 'json-schema';

export class MonacoService extends AbstractService {
  private jsonSchemaSpecs: Map<string, any> = new Map();
  private readonly jsonSchemaDefinitions: NonNullable<monacoAPI.languages.json.DiagnosticsOptions['schemas']> = [];
  private actualVersion = 'X.X.X';
  private monacoInstance!: typeof monacoAPI;
  private activeFileUri = 'asyncapi';
  private isAsyncApiValidationEnabled = true;

  override async onInit() {
    // load monaco instance
    await this.loadMonaco();
    // set monaco theme
    this.setMonacoTheme();
    // prepare JSON Schema specs and definitions for JSON/YAML language config
    this.prepareJSONSchemas();
    // load initial language config (for json and yaml)
    this.setLanguageConfig(this.svcs.specificationSvc.latestVersion);
    // subscribe to document to update JSON/YAML language config
    this.subcribeToDocuments();
  }

  get monaco() {
    return this.monacoInstance;
  }

  updateLanguageConfig(version: SpecVersions = this.svcs.specificationSvc.latestVersion) {
    if (version === this.actualVersion) {
      return;
    }
    this.setLanguageConfig(version);
    this.actualVersion = version;
  }

  setSchemaValidationForFile(
    fileUri: string,
    isAsyncApiDocument: boolean,
    version: SpecVersions = this.actualVersion as SpecVersions,
  ) {
    if (!this.monaco) {
      return;
    }
    this.activeFileUri = this.normalizeUri(fileUri);
    this.isAsyncApiValidationEnabled = isAsyncApiDocument;
    const fallbackVersion = this.svcs.specificationSvc.latestVersion;
    const resolvedVersion: SpecVersions = this.jsonSchemaSpecs.has(version) ? version : fallbackVersion;
    this.setLanguageConfig(resolvedVersion);
  }

  private setLanguageConfig(version: SpecVersions = this.svcs.specificationSvc.latestVersion) {
    if (!this.monaco) {
      return;
    }
    const options = this.prepareLanguageConfig(version);

    // json
    const json = this.monaco.languages.json;
    if (json && json.jsonDefaults) {
      json.jsonDefaults.setDiagnosticsOptions(options);
    }

    // yaml
    setDiagnosticsOptions(options as YAMLDiagnosticsOptions);
  }

  private prepareLanguageConfig(version: SpecVersions): monacoAPI.languages.json.DiagnosticsOptions {
    const fallbackVersion = this.svcs.specificationSvc.latestVersion;
    const spec = this.jsonSchemaSpecs.get(version) || this.jsonSchemaSpecs.get(fallbackVersion);

    const avroSchemaId = String(avroSchema.$id || 'https://json.schemastore.org/avro-avsc.json');
    const schemas: NonNullable<monacoAPI.languages.json.DiagnosticsOptions['schemas']> = [{
      uri: avroSchemaId,
      fileMatch: ['*.avsc', '**/*.avsc'],
      schema: avroSchema,
    }];
    const asyncApiSchemas: NonNullable<monacoAPI.languages.json.DiagnosticsOptions['schemas']> = [];
    if (this.isAsyncApiValidationEnabled && spec) {
      const asyncApiFileMatches = this.fileMatchesForUri(this.activeFileUri);
      asyncApiSchemas.push(
        {
          uri: String(spec.$id || 'https://www.asyncapi.com/definitions/latest'),
          fileMatch: asyncApiFileMatches,
          schema: spec,
        },
        ...this.jsonSchemaDefinitions,
      );
    }

    return {
      enableSchemaRequest: false,
      hover: true,
      completion: true,
      validate: schemas.length > 0,
      format: true,
      schemas: [
        ...schemas,
        ...asyncApiSchemas,
      ],
    } as any;
  }

  private normalizeUri(uri: string): string {
    if (!uri) {
      return 'asyncapi';
    }
    return String(uri).replaceAll('\\', '/');
  }

  private fileMatchesForUri(uri: string): string[] {
    const normalized = this.normalizeUri(uri);
    const baseName = normalized.split('/').pop();
    const matches = [normalized];
    if (baseName && baseName !== normalized) {
      matches.push(`**/${baseName}`);
    }
    return matches;
  }

  private async loadMonaco() {
    // in test environment we don't need monaco loaded
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    try {
      // Use the loader to get Monaco instead of direct import
      this.monacoInstance = await loader.init();
    } catch (error) {
      console.error('Failed to load Monaco:', error);
      // Fallback to direct import if loader fails
      const monaco = this.monacoInstance = await import('monaco-editor');
      loader.config({ monaco });
    }
  }

  private setMonacoTheme() {
    if (!this.monaco) {
      return;
    }

    this.monaco.editor.defineTheme('asyncapi-theme', {
      base: 'vs-dark',
      inherit: true,
      colors: {
        'editor.background': '#252f3f',
        'editor.lineHighlightBackground': '#1f2a37',
      },
      rules: [{ token: '', background: '#252f3f' }],
    });
  }

  private prepareJSONSchemas() {
    const uris: string[] = [];
    Object.entries(this.svcs.specificationSvc.specs).forEach(([version, spec]) => {
      this.serializeSpec(spec, version, uris);
    });
  }

  private serializeSpec(spec: JSONSchema7, version: string, uris: string[]) {
    // copy whole spec
    const copiedSpec = this.copySpecification(spec);

    // serialize definitions
    const definitions = Object.entries(copiedSpec.definitions || {}).map(([uri, schema]) => {
      if (uri === 'http://json-schema.org/draft-07/schema') {
        uri = 'https://json-schema.org/draft-07/schema';
      }

      return {
        uri, 
        schema,
      };
    });
    delete copiedSpec.definitions;

    // save spec to map
    this.jsonSchemaSpecs.set(version, copiedSpec);

    // save definitions
    definitions.forEach(definition => {
      if (uris.includes(definition.uri)) {
        return;
      }

      uris.push(definition.uri);
      this.jsonSchemaDefinitions.push(definition);
    });
  }

  private copySpecification(spec: JSONSchema7): JSONSchema7 {
    return JSON.parse(JSON.stringify(spec, (_, value) => {
      if (
        value === 'http://json-schema.org/draft-07/schema#' ||
        value === 'http://json-schema.org/draft-07/schema'
      ) {
        return 'https://json-schema.org/draft-07/schema';
      }
      return value;
    })) as JSONSchema7;
  }

  private updateFallbackLanguageConfig() {
    try {
      const file = filesState.getState().files['asyncapi'];
      if (!file) {
        return;
      }

      const parsed = YAML.load(file.content) as { asyncapi?: SpecVersions } | undefined;
      const fallbackVersion = parsed?.asyncapi;
      if (fallbackVersion && this.jsonSchemaSpecs.has(fallbackVersion)) {
        this.svcs.monacoSvc.updateLanguageConfig(fallbackVersion);
      }
    } catch (e: any) {
      // intentional
    }
  }

  private handleDocumentVersionChange(document: any, oldDocument: any) {
    if (document === oldDocument) {
      return;
    }

    const version = document.document?.version();
    if (version) {
      this.updateLanguageConfig(version as SpecVersions);
      return;
    }

    this.updateFallbackLanguageConfig();
  }

  private subcribeToDocuments() {
    documentsState.subscribe((state, prevState) => {
      if (!this.isAsyncApiValidationEnabled) {
        return;
      }

      Object.entries(state.documents).forEach(([uri, document]) => {
        this.handleDocumentVersionChange(document, prevState.documents[String(uri)]);
      });
    });
  }
}
