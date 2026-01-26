import { AbstractService } from './abstract.service';

import { encode, decode } from 'js-base64';
import YAML from 'js-yaml';
import toast from 'react-hot-toast';

export class FormatService extends AbstractService {
  convertToYaml(spec: string) {
    try {
      // Editor content -> JS object -> YAML string
      const jsonContent = YAML.load(spec);
      return YAML.dump(jsonContent);
    } catch (err: any) {
      toast.error(`YAML Conversion Error: ${err.message}`, { duration: Infinity });
      console.error(err);
      throw err;
    }
  }

  convertToJSON(spec: string) {
    try {
      // JSON or YAML String -> JS object
      const jsonContent = YAML.load(spec);
      // JS Object -> pretty JSON string
      return JSON.stringify(jsonContent, null, 2);
    } catch (err: any) {
      toast.error(`JSON Conversion Error: ${err.message}`, { duration: Infinity });
      console.error(err);
      throw err;
    }
  }

  encodeBase64(content: string) {
    return encode(content);
  }

  decodeBase64(content: string) {
    return decode(content);
  }

  retrieveLangauge(content: string) {
    if (content.trimStart()[0] === '{') {
      return 'json';
    }
    return 'yaml';
  }
}
