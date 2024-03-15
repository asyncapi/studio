import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ModalsProvider } from '@ebay/nice-modal-react';
// // index.tsx
// import { parseAsyncAPI } from '../scripts/parserDoc';

// // index.tsx
// import { updateUrl } from '../scripts/updateUrl';


import { createServices, ServicesProvider } from './services';
import { App } from './App';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/shift-away.css';
import '@asyncapi/react-component/styles/default.min.css';
import 'reactflow/dist/style.css';
import './tailwind.css';
import './main.css';

function configureMonacoEnvironment() {
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

// async function generateUrlWithQueryParam() {
//   const asyncAPIDocument = await parseAsyncAPI();
//   // Generate the URL with the query parameter using asyncAPIDocument
//   // const urlWithQueryParam = '...'; // Generate the URL based on the asyncAPIDocument
//   return asyncAPIDocument;
// }

async function bootstrap() {
  configureMonacoEnvironment();
  const services = await createServices();

   // This is where you generate the URL with the query parameter
  // updateUrl(urlWithQueryParam); // Update the URL in the browser


  const root = createRoot(
    document.getElementById('root') as HTMLElement,
  );

  root.render(
    <StrictMode>
      <ServicesProvider value={services}>
        <ModalsProvider>
          <App />
        </ModalsProvider>
      </ServicesProvider>
    </StrictMode>
  );
  //  // Generate URL with query parameter
  //  const urlWithQueryParam = await generateUrlWithQueryParam();
  //  // Update the URL in the browser
  //  updateUrl(generaterlWithQueryParam);
}

bootstrap().catch(console.error);
