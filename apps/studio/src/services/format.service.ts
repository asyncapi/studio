import { AbstractService } from './abstract.service';

import { encode, decode } from 'js-base64';
import YAML from 'js-yaml';
import toast from 'react-hot-toast';

export class FormatService extends AbstractService {
  convertToYaml(spec: string) {
    try {
      const jsonContent = YAML.load(spec);
      return YAML.dump(jsonContent);
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error(`YAML Conversion Error: ${errorMessage}`, { duration: Infinity });
      console.error(err);
      throw new Error(`YAML conversion failed: ${errorMessage}`);
    }
  }

  convertToJSON(spec: string) {
    try {
      const jsonContent = YAML.load(spec);
      return JSON.stringify(jsonContent, null, 2);
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error(`JSON Conversion Error: ${errorMessage}`, { duration: Infinity });
      console.error(err);
      throw new Error(`JSON conversion failed: ${errorMessage}`);
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
