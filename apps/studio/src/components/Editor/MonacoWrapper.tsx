'use client'

import { useMemo } from 'react';

import { debounce } from '../../helpers';
import { useServices } from '../../services';
import { useFilesState, useSettingsState } from '../../state';

import type { FunctionComponent } from 'react';
import type { MonacoEditorProps } from 'react-monaco-editor';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('react-monaco-editor'), { ssr: false })

export const MonacoWrapper: FunctionComponent<MonacoEditorProps> = ({
  ...props
}) => {
  const { editorSvc, parserSvc } = useServices();
  const { autoSaving, savingDelay } = useSettingsState(state => state.editor);
  const file = useFilesState(state => state.files['asyncapi']);

  const onChange = useMemo(() => {
    return debounce((v: string) => {
      editorSvc.updateState({ content: v, file: { from: 'storage', source: undefined } });
      autoSaving && editorSvc.saveToLocalStorage(v, false);
      parserSvc.parse('asyncapi', v);
    }, savingDelay);
  }, [autoSaving, savingDelay]);

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

        editorSvc.onDidCreate.bind(editorSvc)
      }}
      language={file.language}
      defaultValue={file.content}
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
