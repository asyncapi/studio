import { AsyncAPIDocument } from '@asyncapi/parser';
// @ts-ignore
import specs from '@asyncapi/specs';
import { loader } from '@monaco-editor/react';
import * as monacoAPI from 'monaco-editor/esm/vs/editor/editor.api';

import { SpecificationService } from './specification.service';
import state from '../state';

export class MonacoService {
  private static actualVersion: string = '2.0.0';
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

  static updateLanguageConfig(document: AsyncAPIDocument) {
    const version =
      (document && document.version()) || SpecificationService.getLastVersion();
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
          uri: 'https://www.asyncapi.com/', // id of the schema
          fileMatch: ['*'], // associate with all models
          schema: specs[asyncAPIVersion],
        },
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

  static registerCompletionItemProviders() {
    const monacoInstance = window.Monaco;
    if (!monacoInstance) return;

    monacoInstance.languages.registerCompletionItemProvider(
      'json',
      MonacoService.getRefsCompletionProvider('json'),
    );
    monacoInstance.languages.registerCompletionItemProvider(
      'yaml',
      MonacoService.getRefsCompletionProvider('yaml'),
    );
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
    this.registerCompletionItemProviders();
    state.editor.monacoLoaded.set(true);
  }

  static getRefsCompletionProvider(
    lang: 'yaml' | 'json',
  ): monacoAPI.languages.CompletionItemProvider {
    return {
      provideCompletionItems: function(model, position) {
        // get editor content before the pointer
        const textUntilPosition = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });
        if (typeof textUntilPosition !== 'string') {
          return { suggestions: [] };
        }

        const trimedPossiblePointer = textUntilPosition
          .trimEnd()
          .endsWith(lang === 'yaml' ? '$ref:' : '"$ref":');
        if (!trimedPossiblePointer) {
          return { suggestions: [] };
        }

        console.log(SpecificationService.getAllRefs());

        // get content info - are we inside of the area where we don't want suggestions,
        // what is the content without those areas
        // let info = getAreaInfo(textUntilPosition); // isCompletionAvailable, clearedText
        // // if we don't want any suggestions, return empty array
        // if (!info.isCompletionAvailable) {
        //     return [];
        // }
        // // if we want suggestions, inside of which tag are we?
        // var lastTag = getLastOpenedTag(info.clearedText);
        // // parse the content (not cleared text) into an xml document
        // var xmlDoc = stringToXml(textUntilPosition);
        // // get opened tags to see what tag we should look for in the XSD schema
        // var openedTags;
        // // get the elements/attributes that are already mentioned in the element we're in
        // var usedItems;
        // // find the last opened tag in the schema to see what elements/attributes it can have
        // var currentItem;

        // return available elements/attributes if the tag exists in the schema or an empty
        // array if it doesn't

        const suggestions = SpecificationService.getAllRefs().map(key => ({
          label: lang === 'yaml' ? `'${key}'` : `"${key}"`,
          kind: monacoAPI.languages.CompletionItemKind.Property,
          insertText: lang === 'yaml' ? `'${key}'` : `"${key}"`,
          range: {
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          },
        }));

        return {
          suggestions,
        };
      },
    };
  }
}
