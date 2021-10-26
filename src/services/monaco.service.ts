import { AsyncAPIDocument } from '@asyncapi/parser';
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

  static updateLanguageConfig(document: AsyncAPIDocument) {
    const version = (document && document.version()) || SpecificationService.getLastVersion();
    if (version === this.actualVersion) {
      return;
    }
    this.loadLanguageConfig(version);
    this.actualVersion = version;
  }

  static prepareLanguageConfig(asyncAPIVersion: string): monacoAPI.languages.json.DiagnosticsOptions {
    return {
      validate: true,
      enableSchemaRequest: true,
      completion: true,
      schemas: [
        {
          uri: 'https://www.asyncapi.com/', // id of the schema
          fileMatch: ['*'], // associate with all models
          schema: specs[String(asyncAPIVersion)],
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
    const schema =
      localStorage.getItem('document') ||
      `asyncapi: '2.0.0'
id: 'urn:rpc:example:client'
defaultContentType: application/json

info:
  title: RPC Client Example
  description: This example demonstrates how to define an RPC client.
  version: '1.0.0'

servers:
  production:
    url: rabbitmq.example.org
    protocol: amqp

channels:
  '{queue}':
    parameters:
      queue:
        schema:
          type: string
          pattern: '^amq\\.gen\\-.+$'
    bindings:
      amqp:
        is: queue
        queue:
          exclusive: true
    subscribe:
      operationId: receiveSumResult
      bindings:
        amqp:
          ack: false
      message:
        correlationId:
          location: $message.header#/correlation_id
        payload:
          $ref: '#/components/schemas/test'

  rpc_queue:
    bindings:
      amqp:
        is: queue
        queue:
          durable: false
    publish:
      operationId: requestSum
      bindings:
        amqp:
          ack: true
      message:
        bindings:
          amqp:
            replyTo:
              type: string
        correlationId:
          location: $message.header#/correlation_id
        payload:
          type: object
          properties:
            numbers:
              type: array
              items:
                type: number
              examples:
                - [4,3]

components:
  schemas:
    test:
      type: object
      properties:
        result:
          type: number
          examples:
            - 7
`;
    state.editor.editorValue.set(schema);
  }
}
