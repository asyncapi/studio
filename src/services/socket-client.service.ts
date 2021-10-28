import { EditorService } from './editor.service';

interface IncomingMessage {
  type: 'file:loaded' | 'file:changed' | 'file:deleted';
  code: string;
}

export class SocketClient {
  private static ws: WebSocket;

  static connect(hostname: string, port: string | number) {
    const ws = this.ws = new WebSocket(`ws://${hostname || 'localhost'}:${port}/live-server`);
    ws.onmessage = this.onMessage;
  }

  static send(content: string) {
    this.ws && this.ws.send(content);
  }

  private static onMessage(event: MessageEvent<any>) {
    const json: IncomingMessage = JSON.parse(event.data);

    switch (json.type) {
      case 'file:loaded':
      case 'file:changed':
        EditorService.updateState({ 
          content: json.code, 
          updateModel: true, 
          sendToServer: false,
        });
        break;
      case 'file:deleted':
        console.warn('Live Server: The file has been deleted on the file system.');
        break;
      default:
        console.warn('Live Server: An unknown even has been received. See details:');
        console.log(json);
    }
  }
}
