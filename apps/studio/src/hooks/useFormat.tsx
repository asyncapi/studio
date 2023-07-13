import { encode, decode } from 'js-base64';
import YAML from 'js-yaml';
import { ServiceProps } from './useServices';

export const useFormat = (props: ServiceProps) => {
  return {
    convertToJSON,
    convertToYaml,
    decodeBase64,
    encodeBase64,
    retrieveLangauge,
  }

  function convertToYaml(spec: string) {
    try {
      // Editor content -> JS object -> YAML string
      const jsonContent = YAML.load(spec);
      return YAML.dump(jsonContent);
    } catch (err) {
      console.error(err);
    }
  }

  function convertToJSON(spec: string) {
    try {
      // JSON or YAML String -> JS object
      const jsonContent = YAML.load(spec);
      // JS Object -> pretty JSON string
      return JSON.stringify(jsonContent, null, 2);
    } catch (err) {
      console.error(err);
    }
  }

  function encodeBase64(content: string) {
    return encode(content);
  }

  function decodeBase64(content: string) {
    return decode(content);
  }

  function retrieveLangauge(content: string) {
    if (content.trimStart()[0] === '{') {
      return 'json';
    }
    return 'yaml';
  }
}
