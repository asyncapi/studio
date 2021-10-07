import fileDownload from 'js-file-download';

import state from '../state';

export class ServerAPIService {
  static serverPath = 'http://localhost:5000';

  static async generate(data: {
    template: string,
  }) {
    const editorState = state.editor;

    return fetch(`${this.serverPath}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        templateParams: {},
        asyncapi: editorState.editorValue.get(),
      }),
    })
      .then(response => response.blob())
      .then(zipFile => {
        console.log(zipFile);
        fileDownload(zipFile, 'asyncapi.zip');
      });
  }
}
