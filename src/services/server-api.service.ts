import { AbstractService } from './abstract.service';

import fileDownload from 'js-file-download';

export interface ServerAPIProblem {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  [key: string]: any;
}

export class ServerAPIService extends AbstractService {
  static serverPath = 'https://api.asyncapi.com/v1';

  static async generate(data: {
    asyncapi: string | Record<string, any>,
    template: string,
    parameters: Record<string, any>,
  }): Promise<Response> {
    const response = await fetch(`${this.serverPath}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const zipFile = await response.blob();
      fileDownload(zipFile, 'asyncapi.zip');
    }

    return response;
  }

  static async retrieveProblem<AP extends Record<string, unknown> = Record<string, unknown>>(response: Response): Promise<ServerAPIProblem & AP | null> {
    if (response.ok || response.status < 400) return null;
    const responseBody = JSON.parse(await response.text());
    return responseBody as ServerAPIProblem & AP;
  }
}
