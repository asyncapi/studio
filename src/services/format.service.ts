import { AbstractService } from './abstract.service';

import { encode, decode } from 'js-base64';
import YAML from 'js-yaml';

export class FormatService extends AbstractService {
  convertToYaml(spec: string) {
    try {
      // Editor content -> JS object -> YAML string
      const jsonContent = YAML.load(spec);
      return YAML.dump(jsonContent);
    } catch (err) {
      console.error(err);
    }
  }

  convertToJSON(spec: string) {
    try {
      // JSON or YAML String -> JS object
      const jsonContent = YAML.load(spec);
      // JS Object -> pretty JSON string
      return JSON.stringify(jsonContent, null, 2);
    } catch (err) {
      console.error(err);
    }
  }

  encodeBase64(content: string) {
    return encode(content);
  }

  decodeBase64(content: string) {
    return decode(content);
  }

  retrieveLangauge(content: string) {
    if (content.trim()[0] === '{') {
      return 'json';
    }
    return 'yaml';
  }
}
