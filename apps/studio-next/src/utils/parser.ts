import Parser from '@asyncapi/parser/browser';
import { OpenAPISchemaParser } from '@asyncapi/openapi-schema-parser';
import { AvroSchemaParser } from '@asyncapi/avro-schema-parser';
import { ProtoBuffSchemaParser } from '@asyncapi/protobuf-schema-parser';

import { documentsState } from '../state';

import type { ParseOptions } from '@asyncapi/parser/cjs';
import { SchemaParser } from '@asyncapi/parser';

export const parse = async (uri: string, spec: string, options: ParseOptions = {}): Promise<void> => {
  const parser = new Parser({
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

  if (uri !== 'asyncapi' && !options.source) {
    options.source = uri;
  }

  try {
    const { document, extras } = await parser.parse(spec, options);
    if (document) {
      documentsState.getState().updateDocument(uri, {
        uri,
        document,
        diagnostics: undefined,
        extras,
        valid: true,
      });

      return;
    } 
  } catch (err: unknown) {
    console.log(err);
  }

  documentsState.getState().updateDocument(uri, {
    uri,
    document: undefined,
    extras: undefined,
    diagnostics: undefined,
    valid: false,
  });
}