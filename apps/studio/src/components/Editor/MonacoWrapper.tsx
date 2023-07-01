'use client';

import dynamic from "next/dynamic";
import { useState } from "react";
import { MonacoEditorProps } from "react-monaco-editor";
const MonacoEditor = dynamic(() => import("react-monaco-editor"), { ssr: false });

const MonacoWrapper : React.FC<MonacoEditorProps> = (props) => {
  // Temporary state for the editor
  // Todo - replace with a store / service and settings

  const [content, setContent] = useState<string>("{}");

  const onChange = (newValue: string) => {
    setContent(newValue);
  };
  
  return (
    <MonacoEditor
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
      width={'100%'}
      height={'100%'}
      language={"json"}
      defaultValue={"{}"}
      value={content}
      theme="asyncapi-theme"
      onChange={onChange}
      options={{
        wordWrap: 'on',
        smoothScrolling: true,
        glyphMargin: true,
      }}
      {...(props || {})}
    />
  );
};

export default MonacoWrapper;


