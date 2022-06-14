// @ts-ignore
import specs from '@asyncapi/specs';
import { loader } from '@monaco-editor/react';
import * as monacoAPI from 'monaco-editor/esm/vs/editor/editor.api';

import { SpecificationService } from './specification.service';
import state from '../state';

import jsonSchemaDraft07 from './json-schema.draft-07';

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
    return {
      validate: true,
      enableSchemaRequest: true,
      completion: true,
      schemas: [
        {
          uri: 'https://www.asyncapi.com/', // id of the AsyncAPI spec schema
          fileMatch: ['*'], // associate with all models
          schema: specs[String(asyncAPIVersion)],
        },
        {
          uri: jsonSchemaDraft07.$id, // id of the draft-07 schema
          fileMatch: ['*'], // associate with all models
          schema: jsonSchemaDraft07,
        }
      ],
    } as any;
  }

  static loadLanguageConfig(asyncAPIVersion: string) {
    const monacoInstance = window.Monaco;
    if (!monacoInstance) return;

    const options = this.prepareLanguageConfig(asyncAPIVersion);

    const json = monacoInstance.languages.json;
    json && json.jsonDefaults && json.jsonDefaults.setDiagnosticsOptions(options);

    const yaml = (monacoInstance.languages as any).yaml;
    yaml && yaml.yamlDefaults && yaml.yamlDefaults.setDiagnosticsOptions(options);
  }

  static loadMonacoConfig() {
    const monacoInstance = window.Monaco;
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
    const monacoInstance = await loader.init();
    window.Monaco = monacoInstance;

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
