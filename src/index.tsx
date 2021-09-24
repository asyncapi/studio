import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// import reportWebVitals from './reportWebVitals';

import '@asyncapi/react-component/styles/default.min.css';
import './tailwind.css';

(window as any).MonacoEnvironment = {
  getWorkerUrl: function(_: any, label: string) {
    if (label === 'json') {
      return '../../js/monaco/json.worker.bundle.js';
    }
    if (label === 'yaml' || label === 'yml') {
      return '../../js/monaco/yaml.worker.bundle.js';
    }
    return '../../js/monaco/editor.worker.bundle.js';
  },
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
