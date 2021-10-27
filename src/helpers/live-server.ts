import { EditorService } from '../services';

export function start(port:string) {
  const ws = new WebSocket(`ws://localhost:${port}/live-server`);
  
  ws.onmessage = function (event) {
    const json = JSON.parse(event.data);
  
    console.log('Live Server:', json);
  
    switch (json.type) {
    case 'file:loaded':
    case 'file:changed':
      EditorService.updateState(json.code, true);
      break;
    case 'file:deleted':
      console.warn('Live Server: The file has been deleted on the file system.');
      break;
    default:
      console.warn('Live Server: An unknown even has been received. See details:');
      console.log(json);
    }
  };
  
  return ws;
}