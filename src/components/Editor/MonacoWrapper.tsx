import { useMemo } from 'react';
import MonacoEditor from '@monaco-editor/react';

import { debounce } from '../../helpers';
import { useServices } from '../../services';
import { useFilesState, useSettingsState } from '../../state';

import type { FunctionComponent } from 'react';
import type { EditorProps as MonacoEditorProps } from '@monaco-editor/react';

export const MonacoWrapper: FunctionComponent<MonacoEditorProps> = ({
  ...props
}) => {
  const { editorSvc, parserSvc } = useServices();
  const { autoSaving, savingDelay } = useSettingsState(state => state.editor);
  const file = useFilesState(state => state.files['asyncapi']);

  const onChange = useMemo(() => {
    return debounce((v: string) => {
      editorSvc.updateState({ content: v });
      autoSaving && editorSvc.saveToLocalStorage(v, false);
      parserSvc.parse('asyncapi', v);
    }, savingDelay);
  }, [autoSaving, savingDelay]);

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
