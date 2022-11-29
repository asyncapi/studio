import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { createServices, ServicesProvider } from './services';
import App from './App';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/shift-away.css';
import '@asyncapi/react-component/styles/default.min.css';
import 'reactflow/dist/style.css';
import './tailwind.css';
import './main.css';

function configureMonacEnv() {
  window.MonacoEnvironment = {
    getWorker(_, label) {
      switch (label) {
      case 'editorWorkerService':
        return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url));
      case 'json':
        return new Worker(
          new URL('monaco-editor/esm/vs/language/json/json.worker', import.meta.url),
        );
      case 'yaml':
      case 'yml':
        return new Worker(new URL('monaco-yaml/yaml.worker', import.meta.url));
      default:
        throw new Error(`Unknown worker ${label}`);
      }
    },
  };
}

async function bootstrap() {
  configureMonacEnv();
  const services = await createServices();

  const root = createRoot(
    document.getElementById('root') as HTMLElement,
  );

  root.render(
    <StrictMode>
      <ServicesProvider value={services}>
        <App />
      </ServicesProvider>
    </StrictMode>
  );
}

bootstrap();
