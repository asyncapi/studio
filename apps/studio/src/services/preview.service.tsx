import { appState } from '@/state';
import { AbstractService } from './abstract.service';
import toast from 'react-hot-toast';

interface IncomingMessage {
    type: 'preview:file:added' | 'preview:file:changed' | 'preview:file:deleted' | 'preview:connected';
    code?: string
}

export class PreviewSockeClient extends AbstractService {
  private ws: WebSocket | null = null;
  private isVerified = false;

  public override onInit(): void {
    // return if the readOnly state is already set by the application service by presence of url and readOnly parameter
    if (appState.getState().readOnly) {
      return
    }
    this.disconnect();
    const {previewServer} = this.svcs.navigationSvc.getUrlParameters();

    const previewServerPort = previewServer && Number(previewServer);

    if (previewServer && previewServerPort) {
      try {
        this.ws = new WebSocket(`ws://${'localhost'}:${previewServerPort}/preview-server`);
        this.ws.onopen = this.onOpen.bind(this);
        this.ws.onerror = this.onError.bind(this);
        this.ws.onmessage = this.handleMessage.bind(this);
      } catch (e) {
        console.log(e)
        this.onError();
      }
    }
  }

  private handleMessage(event: MessageEvent<any>) {
    try {
      const message: IncomingMessage = JSON.parse(event.data);
      if (!this.isVerified) {
        if (message.type === 'preview:connected') {
          this.isVerified = true;
          appState.setState({
            readOnly: true,
            initialized: true,
          });
          return;
        } 
        console.error('Received unexpected message before verification:', message);
        this.disconnect();
        return;
      }
      // after verification handling rest of the messages
      switch (message.type) {
      case 'preview:file:added':
      case 'preview:file:changed':
        this.svcs.editorSvc.updateState({ 
          content: message.code as string, 
          updateModel: true, 
          sendToServer: false,
        });
        break;  
      case 'preview:file:deleted':
        console.warn('Preview Server: The file has been deleted on the file system.');
        break;
      default:
        console.warn('Live Server: An unknown even has been received. See details in console');
        console.error(message);
        break;
      }
    } catch (error) {
      console.log(error)
    }
  }
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isVerified =false;
  }

  private onOpen() {
    toast.success(
      <div>
        <span className="block text-bold">
          Correctly connected to the preview server!
        </span>
      </div>
    );
    appState.setState({ liveServer: true });
  }

  private onError() {
    toast.error(
      <div>
        <span className="block text-bold">
          Failed to connect to preview server. Please check developer console for more information.
        </span>
      </div>
    );
    appState.setState({ liveServer: false });
  }
}