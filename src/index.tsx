import React from 'react';
import ReactDOM from 'react-dom';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import App from './App';

import '@asyncapi/react-component/styles/default.min.css';
// import 'allotment/dist/style.css';
import './tailwind.css';
import './main.css';

window.MonacoEnvironment = window.MonacoEnvironment || {
  getWorkerUrl(_: string, label: string) {
    // for json worker
    if (label === 'json') {
      return '../../js/monaco/json.worker.bundle.js';
    }
    // for yaml worker
    if (label === 'yaml' || label === 'yml') {
      return '../../js/monaco/yaml.worker.bundle.js';
    }
    // for core editor worker
    return '../../js/monaco/editor.worker.bundle.js';
  },
};

ReactDOM.render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <App />
    </DndProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
