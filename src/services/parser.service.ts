import { AbstractService } from './abstract.service';

import { Parser, convertToOldAPI } from '@asyncapi/parser/cjs';
import { OpenAPISchemaParser } from '@asyncapi/parser/cjs/schema-parser/openapi-schema-parser';
import { AvroSchemaParser } from '@asyncapi/parser/cjs/schema-parser/avro-schema-parser';

import type { ParseOptions } from '@asyncapi/parser/cjs';
import type { Resolver } from '@asyncapi/parser/cjs/resolver';

export class ParserService extends AbstractService {
  private parser: Parser = new Parser({
    schemaParsers: [
      OpenAPISchemaParser(),
      AvroSchemaParser(),
    ],
    __unstable: {
      resolver: {
        cache: false,
        resolvers: this.createResolvers(),
      }
    }
  });

  async parse(content: string, options: ParseOptions = {}) {
    try {
      const result = await this.parser.parse(content, options);
      if (result.document) {
        return { ...result, document: convertToOldAPI(result.document) }
      }
      return result;
    } catch(err) {
      console.error(err);
    }
    return this.parser.parse(content, options);
  }

  private createResolvers(): Array<Resolver> {
    const fileSvc = this.svcs.filesSvc;
    function read(uri: Parameters<Resolver['read']>[0]) {
      const file = fileSvc.getFileByUri(uri.valueOf());
      if (file) {
        return file.content;
      }
    }

    return [
      {
        schema: 'file',
        read,
      },
      {
        schema: 'in-memory',
        read,
      }
    ]
  }
}