import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
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

export interface MonacoWrapperProps extends MonacoEditorProps {}

export const MonacoWrapper: React.FunctionComponent<MonacoWrapperProps> = ({
  ...props
}) => {
  const editorState = state.useEditorState();

  async function handleEditorDidMount(
    editor: monacoAPI.editor.IStandaloneCodeEditor,
  ) {
    // save editor instance to the window
    window.Editor = editor;
    // parse on first run the spec
    SpecificationService.parseSpec(EditorService.getValue());

    // apply save command
    editor.addCommand(
      monacoAPI.KeyMod.CtrlCmd | monacoAPI.KeyCode.KEY_S,
      function() {
        const editorValue = EditorService.getValue();
        localStorage.setItem('document', editorValue);
        toast.success(
          <div>
            <span className="block text-bold">
              Document succesfully saved to the local storage!
            </span>
          </div>,
        );
      },
    );

    // mark editor as loaded
    editorState.editorLoaded.set(true);
  }

  const onChange = debounce((v: string) => {
    EditorService.updateState(v);
    SpecificationService.parseSpec(v);
  }, 250);

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
      }}
      {...(props || {})}
    />
  ) : null;
};
