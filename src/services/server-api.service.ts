import fileDownload from 'js-file-download';

export class ServerAPIService {
  static serverPath = 'http://localhost:80/v1';

  static async generate(data: {
    asyncapi: string | Record<string, any>,
    template: string,
  }): Promise<{ ok: boolean, statusText: string }> {
    const response = await fetch(`${this.serverPath}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    });

    if (response.ok) {
      const zipFile = await response.blob();
      fileDownload(zipFile, 'asyncapi.zip');
    }

    return { ok: response.ok, statusText: response.statusText };
  }

  static getTemplates() {
    return [
      '@asyncapi/html-template',
      '@asyncapi/markdown-template',
    ];
  }
}