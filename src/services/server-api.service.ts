import fileDownload from 'js-file-download';

export class ServerAPIService {
  static serverPath = 'http://localhost:5000/v1';

  static async generate(data: {
    asyncapi: string | object,
    template: string,
  }) {
    const response = await fetch(`${this.serverPath}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        // parameters: {},
      }),
    });
    const zipFile = await response.blob();
    fileDownload(zipFile, 'asyncapi.zip');
  }

  static getTemplates() {
    return [
      '@asyncapi/html-template',
      '@asyncapi/markdown-template',
    ];
  }
}