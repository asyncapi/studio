import React, { useEffect } from 'react';
import MonacoEditor, {
  EditorProps as MonacoEditorProps,
} from '@monaco-editor/react';
import * as monacoAPI from 'monaco-editor/esm/vs/editor/editor.api';

import { debounce } from '../../helpers';
import {
  EditorService,
  MonacoService,
  SpecificationService,
} from '../../services';
import state from '../../state';

export type MonacoWrapperProps = MonacoEditorProps

export const MonacoWrapper: React.FunctionComponent<MonacoWrapperProps> = ({
  ...props
}) => {
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
    SpecificationService.parseSpec(EditorService.getValue());

    // apply save command
    editor.addCommand(
      monacoAPI.KeyMod.CtrlCmd | monacoAPI.KeyCode.KeyS,
      () => EditorService.saveToLocalStorage(),
    );

    // mark editor as loaded
    editorState.editorLoaded.set(true);
  }

  const onChange = debounce((v: string) => {
    EditorService.updateState({ content: v });
    if (autoSaving) {
      autoSaving && EditorService.saveToLocalStorage(v, false);
    }
    SpecificationService.parseSpec(v);
  }, savingDelay);

  useEffect(() => {
    MonacoService.loadMonaco();
  }, []);

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
