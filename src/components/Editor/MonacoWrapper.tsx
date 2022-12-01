import { useMemo } from 'react';
import MonacoEditor from '@monaco-editor/react';

import { debounce } from '../../helpers';
import { useServices } from '../../services';
import state from '../../state';
import { useSettingsState } from '../../state/index.state';

import type { FunctionComponent } from 'react';
import type { EditorProps as MonacoEditorProps } from '@monaco-editor/react';

export const MonacoWrapper: FunctionComponent<MonacoEditorProps> = ({
  ...props
}) => {
  const { editorSvc, parserSvc } = useServices();
  const { autoSaving, savingDelay } = useSettingsState(state => state.editor);
  const editorState = state.useEditorState();

  const onChange = useMemo(() => {
    return debounce((v: string) => {
      editorSvc.updateState({ content: v });
      autoSaving && editorSvc.saveToLocalStorage(v, false);
      parserSvc.parse('asyncapi', v);
    }, savingDelay);
  }, [autoSaving, savingDelay]);

  return (
    <MonacoEditor
      language={editorState.language.get()}
      defaultValue={editorState.editorValue.get()}
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
