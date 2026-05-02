'use client'
import { useMemo, FunctionComponent } from 'react';
import MonacoEditor from '@monaco-editor/react';

import { debounce } from '@/helpers';
import { useServices } from '@/services';
import { useFilesState } from '@/state';

import type { EditorProps as MonacoEditorProps } from '@monaco-editor/react';

export const MonacoWrapper: FunctionComponent<MonacoEditorProps> = ({
  ...props
}) => {
  const { editorSvc } = useServices();
  const file = useFilesState(state => state.files['asyncapi']);
  const editorChangeDebounceMs = 300;

  const onChange = useMemo(() => {
    return debounce((v: string) => {
      // Preserve the current source URL instead of setting to undefined
      const currentSource = file?.source;
      editorSvc.updateState({ content: v, file: { source: currentSource, modified: true } });
      // subscribeToFiles will trigger a re-parse when content changes
    }, editorChangeDebounceMs);
  }, [file?.source, editorSvc]);

  if (!file) {
    return null;
  }

  return (
    <MonacoEditor
      key={file.uri}
      path={file.uri}
      language={file.language}
      value={file.content}
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
