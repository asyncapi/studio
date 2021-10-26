import { FormatService } from '../format.service';

describe('FormatService', () => {
  describe('.convertToYaml', () => {
    const validYAML = 'asyncapi: 2.2.0\nfoobar: barfoo\n';

    test('should work with valid yaml', () => {
      const result = FormatService.convertToYaml(validYAML);
      expect(result).toEqual(validYAML);
    });

    test('should work with valid stringified JSON', () => {
      const json = '{"asyncapi": "2.2.0", "foobar": "barfoo"}';
      const result = FormatService.convertToYaml(json);
      expect(result).toEqual(validYAML);
    });
  });

  describe('.convertToJson', () => {
    const validJSON = JSON.stringify({ asyncapi: '2.2.0', foobar: 'barfoo' }, undefined, 2);

    test('should work with valid yaml', () => {
      const result = FormatService.convertToJSON('asyncapi: 2.2.0\nfoobar: barfoo\n');
      expect(result).toEqual(validJSON);
    });

    test('should work with valid stringified JSON', () => {
      const result = FormatService.convertToJSON(validJSON);
      expect(result).toEqual(validJSON);
    });
  });

  describe('.encodeBase64', () => {
    test('should properly encode content to base64', () => {
      const result = FormatService.encodeBase64('hello world!');
      expect(result).toEqual('aGVsbG8gd29ybGQh');
    });
  });

  describe('.decodeBase64', () => {
    test('should properly decode content from base64', () => {
      const result = FormatService.decodeBase64('aGVsbG8gd29ybGQh');
      expect(result).toEqual('hello world!');
    });
  });

  describe('.retrieveLangauge', () => {
    test('should check that content is yaml', () => {
      const result = FormatService.retrieveLangauge('asyncapi: 2.2.0\nfoobar: barfoo\n');
      expect(result).toEqual('yaml');
    });

    test('should check that content is json', () => {
      const result = FormatService.retrieveLangauge('{"asyncapi": "2.2.0", "foobar": "barfoo"}');
      expect(result).toEqual('json');
    });

    test('should check that content is yaml - fallback for non json content', () => {
      const result = FormatService.retrieveLangauge('');
      expect(result).toEqual('yaml');
    });
  });
});