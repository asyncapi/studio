'use client'

import dynamic from 'next/dynamic';
import { AsyncAPIStudio } from './studio';

import { useState, type FunctionComponent } from 'react';
const MonacoEditor = dynamic(import("@monaco-editor/react"), { ssr: false });

export default function App() {
  const [postBody, setPostBody] = useState("");
  // etc
  return (<div>
  {/* etc */}
    <MonacoEditor
        // @ts-ignore
      editorDidMount={() => {
        window.MonacoEnvironment!.getWorkerUrl = (
          _moduleId: string,
          label: string
        ) => {
          if (label === "json")
            return "_next/static/json.worker.js";
          if (label === "css")
            return "_next/static/css.worker.js";
          if (label === "html")
            return "_next/static/html.worker.js";
          if (
            label === "typescript" ||
            label === "javascript"
          )
            return "_next/static/ts.worker.js";
          return "_next/static/editor.worker.js";
        };
      }}
      width="800"
      height="600"
      language="markdown"
      theme="vs-dark"
      value={postBody}
      options={{
        minimap: {
          enabled: false
        }
      }}
      onChange={(val) => setPostBody(val || "")}
    />
  </div>)
};
