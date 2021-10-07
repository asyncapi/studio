export class GeneratorService {
  static getTemplates() {
    return {
      'html-template': '@asyncapi/html-template',
      'markdown-template': '@asyncapi/markdown-template',
    };
  }
}
