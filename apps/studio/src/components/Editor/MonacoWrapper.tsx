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

  const { parserSvc, editorSvc } = useServices();
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
      editorDidMount={editorSvc.onMount}
      width={'100%'}
      height={'100%'}
      language={"json"}
      defaultValue={file.content}
      value={file.content}
      theme={"asyncapi-theme"} // Work on defining a theme
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


