import { useEffect, useState, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';

import { debounce } from '../../helpers';
import { useServices } from '../../services';
import { useFilesState, usePanelsState, useSettingsState } from '../../state';

import type { FunctionComponent } from 'react';
import type { EditorProps as MonacoEditorProps } from '@monaco-editor/react';

export const MonacoWrapper: FunctionComponent<MonacoEditorProps> = (props) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const { editorSvc } = useServices();
  // const { autoSaving, savingDelay } = useSettingsState(state => state.editor);
  // const { tabs, activeTab } = usePanelsState(state => state.panels['primary']);
  // const fileUri = tabs.find(t => t.id === activeTab)?.uri || 'asyncapi';
  // const file = useFilesState(state => state.files[fileUri]);

  useEffect(() => {
    if (editorRef.current) {
      editorSvc.onSetupEditor(editorRef.current);
    }
  }, []);

  // const onChange = useMemo(() => {
  //   return debounce((v: string) => {
  //     editorSvc.updateState({ content: v });
  //     autoSaving && editorSvc.saveToLocalStorage(v, false);
  //     parserSvc.parse('asyncapi', v);
  //   }, savingDelay);
  // }, []);

  return (
    <div className='flex flex-row items-center justify-between w-full h-full'>
      <div 
        className='flex flex-row items-center justify-between w-full h-full'
        ref={editorRef} 
      />
    </div>
  );

  // return (
  //   <MonacoEditor
  //     language={file.language}
  //     defaultValue={file.content}
  //     theme="asyncapi-theme"
  //     onMount={editorSvc.onSetupEditor.bind(editorSvc)}
  //     onChange={onChange}
  //     options={{
  //       wordWrap: 'on',
  //       smoothScrolling: true,
  //       glyphMargin: true,
  //     }}
  //     {...(props || {})}
  //   />
  // );
};
