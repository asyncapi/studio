import React from 'react';
import MonacoEditor, {
  EditorProps as MonacoEditorProps,
} from '@monaco-editor/react';
import * as monacoAPI from 'monaco-editor/esm/vs/editor/editor.api';

import { debounce } from '../../helpers';
import { useServices } from '../../services';
import state from '../../state';

export type MonacoWrapperProps = MonacoEditorProps

export const MonacoWrapper: React.FunctionComponent<MonacoWrapperProps> = ({
  ...props
}) => {
  const { editorSvc, specificationSvc } = useServices();
  const editorState = state.useEditorState();
  const settingsState = state.useSettingsState();
  const autoSaving = settingsState.editor.autoSaving.get();
  const savingDelay = settingsState.editor.savingDelay.get();

  async function handleEditorDidMount(
    editor: monacoAPI.editor.IStandaloneCodeEditor,
  ) {
    // save editor instance to the window
    window.Editor = editor;
    // parse on first run the spec
    specificationSvc.parseSpec(editorSvc.getValue());

    // apply save command
    editor.addCommand(
      monacoAPI.KeyMod.CtrlCmd | monacoAPI.KeyCode.KeyS,
      () => editorSvc.saveToLocalStorage(),
    );

    // mark editor as loaded
    editorState.editorLoaded.set(true);
  }

  const onChange = debounce((v: string) => {
    editorSvc.updateState({ content: v });
    autoSaving && editorSvc.saveToLocalStorage(v, false);
    specificationSvc.parseSpec(v);
  }, savingDelay);

  return editorState.monacoLoaded.get() ? (
    <MonacoEditor
      language={editorState.language.get()}
      defaultValue={editorState.editorValue.get()}
      theme="asyncapi-theme"
      onMount={handleEditorDidMount}
      onChange={onChange}
      options={{
        wordWrap: 'on',
        smoothScrolling: true,
        glyphMargin: true,
      }}
      {...(props || {})}
    />
  ) : null;
};
