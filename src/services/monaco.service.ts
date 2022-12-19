import { AbstractService } from './abstract.service';

import { loader } from '@monaco-editor/react';
import { setDiagnosticsOptions } from 'monaco-yaml';
import YAML from 'js-yaml';

import { documentsState, filesState } from '../state';

import type * as monacoAPI from 'monaco-editor/esm/vs/editor/editor.api';
import type { DiagnosticsOptions as YAMLDiagnosticsOptions } from 'monaco-yaml';
import type { SpecVersions } from '../types';
import type { JSONSchema7 } from 'json-schema';

export class MonacoService extends AbstractService {
  private jsonSchemaSpecs: Map<string, any> = new Map();
  private jsonSchemaDefinitions: monacoAPI.languages.json.DiagnosticsOptions['schemas'] = [];
  private actualVersion = 'X.X.X';
  private monacoInstance!: typeof monacoAPI;

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

  private prepareLanguageConfig(
    version: SpecVersions,
  ): monacoAPI.languages.json.DiagnosticsOptions {
    const spec = this.jsonSchemaSpecs.get(version);

    return {
      enableSchemaRequest: false,
      hover: true,
      completion: true,
      validate: true,
      format: true,
      schemas: [
        {
          uri: spec.$id, // id of the AsyncAPI spec schema
          fileMatch: ['*'], // associate with all models
          schema: spec,
        },
        ...(this.jsonSchemaDefinitions || []),
      ],
    } as any;
  }

  private async loadMonaco() {
    // in test environment we don't need monaco loaded
    if (process.env.NODE_ENV === 'test') {
      return;
    }
    
    const monaco = this.monacoInstance = await import('monaco-editor');
    loader.config({ monaco });
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
      if (Array.isArray(this.jsonSchemaDefinitions)) {
        this.jsonSchemaDefinitions.push(definition);
      }
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

  private subcribeToDocuments() {
    documentsState.subscribe((state, prevState) => {
      const newDocuments = state.documents;
      const oldDocuments = prevState.documents;

      Object.entries(newDocuments).forEach(([uri, document]) => {
        const oldDocument = oldDocuments[String(uri)];
        if (document === oldDocument) return;
        const version = document.document?.version();
        if (version) {
          this.updateLanguageConfig(version as SpecVersions);
        } else {
          try {
            const file = filesState.getState().files['asyncapi'];
            if (file) {
              const version = (YAML.load(file.content) as { asyncapi: SpecVersions }).asyncapi;
              this.svcs.monacoSvc.updateLanguageConfig(version);
            }
          } catch (e: any) {
            // intentional
          }
        }
      });
    });
  }
}
