// @ts-ignore
import specs from '@asyncapi/specs';
import { loader } from '@monaco-editor/react';
import * as monacoAPI from 'monaco-editor/esm/vs/editor/editor.api';

import { SpecificationService } from './specification.service';
import state from '../state';

export class MonacoService {
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

  static updateLanguageConfig(version: string = SpecificationService.getLastVersion()) {
    if (version === this.actualVersion) {
      return;
    }
    this.loadLanguageConfig(version);
    this.actualVersion = version;
  }

  static prepareLanguageConfig(
    asyncAPIVersion: string,
  ): monacoAPI.languages.json.DiagnosticsOptions {
    const spec = { ...specs[String(asyncAPIVersion)] };
    const definitions = Object.entries(spec.definitions).map(([uri, schema]) => ({
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

  static loadLanguageConfig(asyncAPIVersion: string) {
    const monacoInstance = window.monaco as any;
    if (!monacoInstance) return;

    const options = this.prepareLanguageConfig(asyncAPIVersion);

    const json = monacoInstance.languages.json;
    json && json.jsonDefaults && json.jsonDefaults.setDiagnosticsOptions(options);

    const yaml = monacoInstance.languages.yaml;
    yaml && yaml.yamlDefaults && yaml.yamlDefaults.setDiagnosticsOptions(options);
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
    
    // load yaml plugin
    // @ts-ignore
    await import('monaco-yaml/lib/esm/monaco.contribution');
    
    // load language config (for json and yaml)
    this.loadLanguageConfig(SpecificationService.getLastVersion());
    state.editor.monacoLoaded.set(true);
  }
}
