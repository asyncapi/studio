import { encode, decode } from 'js-base64';
import YAML from 'js-yaml';

export class FormatService {
  static convertToYaml(spec: string) {
    try {
      // Editor content -> JS object -> YAML string
      const jsonContent = YAML.load(spec);
      return YAML.dump(jsonContent);
    } catch (err) {
      console.error(err);
    }
  }

  static convertToJson(spec: string) {
    try {
      // JSON or YAML String -> JS object
      const jsonContent = YAML.load(spec);
      // JS Object -> pretty JSON string
      return JSON.stringify(jsonContent, null, 2);
    } catch (err) {
      console.error(err);
    }
  }

  static encodeBase64(content: string) {
    return encode(content);
  }

  static decodeBase64(content: string) {
    return decode(content);
  }

  static retrieveLangauge(content: string) {
    if (content.trim()[0] === '{') {
      return 'json';
    }
    return 'yaml';
  }
}
