import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/shift-away.css';
import '@asyncapi/react-component/styles/default.min.css';
import './tailwind.css';
import './main.css';

window.MonacoEnvironment = window.MonacoEnvironment || {
  getWorkerUrl(_: string, label: string) {
    // for json worker
    if (label === 'json') {
      return `${process.env.PUBLIC_URL}/js/monaco/json.worker.bundle.js`;
    }
    // for yaml worker
    if (label === 'yaml' || label === 'yml') {
      return `${process.env.PUBLIC_URL}/js/monaco/yaml.worker.bundle.js`;
    }
    // for core editor worker
    return `${process.env.PUBLIC_URL}/js/monaco/editor.worker.bundle.js`;
  },
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
