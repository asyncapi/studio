import { AbstractService } from './abstract.service';

import toast from 'react-hot-toast';

import state from '../state';

interface IncomingMessage {
  type: 'file:loaded' | 'file:changed' | 'file:deleted';
  code?: string;
}

export class SocketClient extends AbstractService {
  private ws!: WebSocket;

  connect(hostname: string, port: string | number) {
    try {
      const ws = this.ws = new WebSocket(`ws://${hostname || 'localhost'}:${port}/live-server`);

      ws.onopen = this.onOpen;
      ws.onmessage = this.onMessage;
      ws.onerror = this.onError;
    } catch (e) {
      console.error(e);
      this.onError();
    }
  }

  send(eventName: string, content: Record<string, unknown>) {
    this.ws && this.ws.send(JSON.stringify({ type: eventName, ...content }));
  }

  private onMessage(event: MessageEvent<any>) {
    try {
      const json: IncomingMessage = JSON.parse(event.data);
  
      switch (json.type) {
      case 'file:loaded':
      case 'file:changed':
        this.svcs.editorSvc.updateState({ 
          content: json.code as string, 
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
    } catch (e) {
      console.error(`Live Server: An invalid event has been received. See details:\n${event.data}`);
    }
  }

  private onOpen() {
    toast.success(
      <div>
        <span className="block text-bold">
          Correctly connected to the live server!
        </span>
      </div>
    );
    state.app.liveServer.set(true);
  }

  private onError() {
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
