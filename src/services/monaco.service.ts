import { AbstractService } from './abstract.service';

import specs from '@asyncapi/specs';
import { loader } from '@monaco-editor/react';
import { setDiagnosticsOptions } from 'monaco-yaml';

import state from '../state';

import type * as monacoAPI from 'monaco-editor/esm/vs/editor/editor.api';
import type { DiagnosticsOptions as YAMLDiagnosticsOptions } from 'monaco-yaml';
import type { SpecVersions } from '../types';

export class MonacoService extends AbstractService {
  private actualVersion = 'X.X.X';
  private Monaco: any = null;
  private Editor: any = null;

  override async onInit() {
    // load monaco instance
    await this.loadMonaco();
    // set monaco theme
    this.setMonacoTheme();
    // load initial language config (for json and yaml)
    this.setLanguageConfig(this.svcs.specificationSvc.getLastVersion());
    // update state
    state.editor.monacoLoaded.set(true);
  }

  get monaco() {
    return this.Monaco;
  }
  set monaco(value: any) {
    this.Monaco = value;
  }

  get editor() {
    return this.Editor;
  }
  set editor(value: any) {
    this.Editor = value;
  }

  updateLanguageConfig(version: SpecVersions = this.svcs.specificationSvc.getLastVersion()) {
    if (version === this.actualVersion) {
      return;
    }
    this.setLanguageConfig(version);
    this.actualVersion = version;
  }

  prepareLanguageConfig(
    asyncAPIVersion: SpecVersions,
  ): monacoAPI.languages.json.DiagnosticsOptions {
    const spec = { ...specs[String(asyncAPIVersion) as SpecVersions] };
    const definitions = Object.entries(spec.definitions || {}).map(([uri, schema]) => ({
      uri,
      schema,
    }));
    delete spec.definitions;

    return {
      enableSchemaRequest: true,
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
        ...definitions,
      ],
    } as any;
  }

  private async loadMonaco() {
    // We don't need test monaco instance in test env
    if (process.env.NODE_ENV === 'test') {
      return;
    }
    
    const monaco = window.monaco = await import('monaco-editor');
    loader.config({ monaco });
  }

  private setLanguageConfig(asyncAPIVersion: SpecVersions) {
    const monacoInstance = window.monaco;
    if (!monacoInstance) return;

    const options = this.prepareLanguageConfig(asyncAPIVersion);

    // json
    const json = monacoInstance.languages.json;
    json && json.jsonDefaults && json.jsonDefaults.setDiagnosticsOptions(options);

    // yaml
    setDiagnosticsOptions(options as YAMLDiagnosticsOptions);
  }

  private setMonacoTheme() {
    const monacoInstance = window.monaco;
    if (!monacoInstance) return;

    monacoInstance.editor.defineTheme('asyncapi-theme', {
      base: 'vs-dark',
      inherit: true,
      colors: {
        'editor.background': '#252f3f',
        'editor.lineHighlightBackground': '#1f2a37',
      },
      rules: [{ token: '', background: '#252f3f' }],
    });
  }
}
