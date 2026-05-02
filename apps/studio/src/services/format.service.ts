import { AbstractService } from './abstract.service';

import { encode, decode } from 'js-base64';
import YAML from 'js-yaml';

export type SpecType = 'asyncapi' | 'openapi' | 'unknown';

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
    if (content.trimStart()[0] === '{') {
      return 'json';
    }
    return 'yaml';
  }

  detectSpecType(content: string): SpecType {
    const text = String(content || '').trim();
    if (!text) {
      return 'unknown';
    }

    let parsed: any;
    try {
      parsed = text.startsWith('{') ? JSON.parse(text) : YAML.load(text);
    } catch {
      return 'unknown';
    }

    if (!parsed || typeof parsed !== 'object') {
      return 'unknown';
    }

    if (typeof parsed.asyncapi === 'string') {
      return 'asyncapi';
    }

    if (typeof parsed.openapi === 'string' || typeof parsed.swagger === 'string') {
      return 'openapi';
    }

    return 'unknown';
  }
}
