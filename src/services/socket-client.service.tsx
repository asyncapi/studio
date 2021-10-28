import toast from 'react-hot-toast';

import { EditorService } from './editor.service';

import state from '../state';

interface IncomingMessage {
  type: 'file:loaded' | 'file:changed' | 'file:deleted';
  code: string;
}

export class SocketClient {
  private static ws: WebSocket;

  static connect(hostname: string, port: string | number) {
    try {
      const ws = this.ws = new WebSocket(`ws://${hostname || 'localhost'}:${port}/live-server`);

      ws.onopen = this.onOpen;
      ws.onmessage = this.onMessage;
      ws.onerror = this.onError;
    } catch(e) {
      console.error(e);
      this.onError(e);
    }
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

  private static onOpen(_: any) {
    toast.success(
      <div>
        <span className="block text-bold">
          Correctly connected to the live server!
        </span>
      </div>
    );
    state.app.liveServer.set(true);
  }

  private static onError(_: any) {
    toast.error(
      <div>
        <span className="block text-bold">
          Failed to connect to live server. Please check developer console for more information.
        </span>
      </div>
    );
    state.app.liveServer.set(false);
  }
}
