'use client';

import dynamic from "next/dynamic";
import { MonacoEditorProps } from "react-monaco-editor";
import { debounce } from "../../helpers";
import { useFilesState } from "../../states";
const MonacoEditor = dynamic(() => import("react-monaco-editor"), { ssr: false });

import { useEffect } from "react";
import { useServices } from "../../hooks";

const MonacoWrapper : React.FC<MonacoEditorProps> = (props) => {  
  const file = useFilesState(state => state.files['asyncapi']);
  const updateFile = useFilesState(state => state.updateFile);

  const { parserSvc } = useServices();
  const { parse } = parserSvc;

  useEffect(() => {
    parse('asyncapi', file.content);
  }, []);  

  const onChange = debounce((value: string) => {
    updateFile('asyncapi', {
      uri: 'asyncapi',
      name: 'asyncapi',
      content: value,
      from: 'storage',
      source: undefined,
      language: value.trimStart()[0] === '{' ? 'json' : 'yaml',
      modified: false,
      stat: {
        mtime: (new Date()).getTime(),
      }
    });
  }, 200);

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
      defaultValue={file.content}
      value={file.content}
      theme={"vs-dark"} // Work on defining a theme
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


