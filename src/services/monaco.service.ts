import { AbstractService } from './abstract.service';

import specs from '@asyncapi/specs';
import { loader } from '@monaco-editor/react';
import { setDiagnosticsOptions } from 'monaco-yaml';

import { SpecificationService } from './specification.service';
import state from '../state';

import type * as monacoAPI from 'monaco-editor/esm/vs/editor/editor.api';
import type { DiagnosticsOptions as YAMLDiagnosticsOptions } from 'monaco-yaml';
import type { SpecVersions } from '../types';

export class MonacoService extends AbstractService {
  private static actualVersion = 'X.X.X';
  private static Monaco: any = null;
  private static Editor: any = null;

  static get monaco() {
    return MonacoService.Monaco;
  }
  static set monaco(value: any) {
    MonacoService.Monaco = value;
  }

  static get editor() {
    return MonacoService.Editor;
  }
  static set editor(value: any) {
    MonacoService.Editor = value;
  }

  static updateLanguageConfig(version: SpecVersions = SpecificationService.getLastVersion()) {
    if (version === this.actualVersion) {
      return;
    }
    this.loadLanguageConfig(version);
    this.actualVersion = version;
  }

  static prepareLanguageConfig(
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

  static loadLanguageConfig(asyncAPIVersion: SpecVersions) {
    const monacoInstance = window.monaco;
    if (!monacoInstance) return;

    const options = this.prepareLanguageConfig(asyncAPIVersion);

    // json
    const json = monacoInstance.languages.json;
    json && json.jsonDefaults && json.jsonDefaults.setDiagnosticsOptions(options);

    // yaml
    setDiagnosticsOptions(options as YAMLDiagnosticsOptions);
    // const yaml = (monacoInstance.languages as any).yaml;
    // yaml && yaml.yamlDefaults && yaml.yamlDefaults.setDiagnosticsOptions(options);
  }

  static loadMonacoConfig() {
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

  static async loadMonaco() {
    let monaco: typeof monacoAPI;

    // JEST cannot bundle monaco-editor in test environment so we need to fetch that package from cdn
    // in dev or production environment we will use bundled monaco-editor
    if (process.env.NODE_ENV === 'test') {
      monaco = await loader.init();
    } else {
      monaco = await import('monaco-editor');
      loader.config({ monaco });
    }
    window.monaco = monaco;

    // load monaco config
    this.loadMonacoConfig();
    
    // load language config (for json and yaml)
    this.loadLanguageConfig(SpecificationService.getLastVersion());
    state.editor.monacoLoaded.set(true);
  }
}
