import { createServices } from '../';

import type { FormatService } from '../format.service';

describe('FormatService', () => {
  let formatSvc: FormatService;

  beforeAll(async () => {
    const services = await createServices();
    formatSvc = services.formatSvc;
  });

  describe('.convertToYaml', () => {
    const validYAML = 'asyncapi: 2.2.0\nfoobar: barfoo\n';

    test('should work with valid yaml', () => {
      const result = formatSvc.convertToYaml(validYAML);
      expect(result).toEqual(validYAML);
    });

    test('should work with valid stringified JSON', () => {
      const json = '{"asyncapi": "2.2.0", "foobar": "barfoo"}';
      const result = formatSvc.convertToYaml(json);
      expect(result).toEqual(validYAML);
    });
  });

  describe('.convertToJson', () => {
    const validJSON = JSON.stringify({ asyncapi: '2.2.0', foobar: 'barfoo' }, undefined, 2);

    test('should work with valid yaml', () => {
      const result = formatSvc.convertToJSON('asyncapi: 2.2.0\nfoobar: barfoo\n');
      expect(result).toEqual(validJSON);
    });

    test('should work with valid stringified JSON', () => {
      const result = formatSvc.convertToJSON(validJSON);
      expect(result).toEqual(validJSON);
    });
  });

  describe('.encodeBase64', () => {
    test('should properly encode content to base64', () => {
      const result = formatSvc.encodeBase64('hello world!');
      expect(result).toEqual('aGVsbG8gd29ybGQh');
    });
  });

  describe('.decodeBase64', () => {
    test('should properly decode content from base64', () => {
      const result = formatSvc.decodeBase64('aGVsbG8gd29ybGQh');
      expect(result).toEqual('hello world!');
    });
  });

  describe('.retrieveLangauge', () => {
    test('should check that content is yaml', () => {
      const result = formatSvc.retrieveLangauge('asyncapi: 2.2.0\nfoobar: barfoo\n');
      expect(result).toEqual('yaml');
    });

    test('should check that content is json', () => {
      const result = formatSvc.retrieveLangauge('{"asyncapi": "2.2.0", "foobar": "barfoo"}');
      expect(result).toEqual('json');
    });

    test('should check that content is yaml - fallback for non json content', () => {
      const result = formatSvc.retrieveLangauge('');
      expect(result).toEqual('yaml');
    });
  });
});