'use client'
import { useMemo, FunctionComponent } from 'react';
import MonacoEditor from '@monaco-editor/react';

import { debounce } from '@/helpers';
import { useServices } from '@/services';
import { useFilesState, useSettingsState } from '@/state';

import type { EditorProps as MonacoEditorProps } from '@monaco-editor/react';

export const MonacoWrapper: FunctionComponent<MonacoEditorProps> = ({
  ...props
}) => {
  const { editorSvc, parserSvc } = useServices();
  const { autoSaving, savingDelay } = useSettingsState(state => state.editor);
  const file = useFilesState(state => state.files['asyncapi']);

  const onChange = useMemo(() => {
    return debounce((v: string) => {
      // Preserve the current source URL instead of setting to undefined
      const currentSource = file?.source;
      editorSvc.updateState({ content: v, file: { from: 'storage', source: currentSource } });
      autoSaving && editorSvc.saveToLocalStorage(v, false);
      // Pass source to parser to maintain remote $refs support
      parserSvc.parse('asyncapi', v, { source: currentSource });
    }, savingDelay);
  }, [autoSaving, savingDelay, file?.source]);

  return (
    <MonacoEditor
      language={file.language}
      defaultValue={file.content}
      theme="asyncapi-theme"
      onMount={editorSvc.onDidCreate.bind(editorSvc)}
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
