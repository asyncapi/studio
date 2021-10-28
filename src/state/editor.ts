import { createState, useState } from '@hookstate/core';

const schema =
  localStorage.getItem('document') ||
  `asyncapi: 2.2.0
id: 'urn:rpc:example:client'
defaultContentType: application/json

info:
  title: RPC Client Example
  description: This example demonstrates how to define an RPC client.
  version: 1.0.0

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
          pattern: ^amq\\.gen\\-.+$
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
                - - 4
                  - 3
                  
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

export type EditorStateDocumentFrom = 'localStorage' | `URL: ${string}` | 'Base64';

export interface EditorState {
  height: string;
  fileName: string;
  language: string;
  editorValue: string;
  monacoLoaded: boolean;
  editorLoaded: boolean;
  documentFrom: EditorStateDocumentFrom;
  decorations: Array<any>;
}

export const editorState = createState<EditorState>({
  height: 'calc(100% - 36px)',
  fileName: 'asyncapi',
  language: schema.trim()[0] === '{' ? 'json' : 'yaml',
  editorValue: schema,
  monacoLoaded: false,
  editorLoaded: false,
  documentFrom: 'localStorage',
  decorations: [],
});

export function useEditorState() {
  return useState(editorState);
}
