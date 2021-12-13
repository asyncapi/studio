import React, { useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import MonacoEditor, {
  EditorProps as MonacoEditorProps,
} from '@monaco-editor/react';
import * as monacoAPI from 'monaco-editor/esm/vs/editor/editor.api';

import { debounce } from '../../helpers';
import { MonacoService, EditorsManager, FilesManager, SpecificationService } from '../../services';

import state from '../../state';
import { TabContext } from '../Panels/Tabs';
import { sampleSpec } from '../../state/editor';

interface EditorProps extends MonacoEditorProps {}

export const Editor: React.FunctionComponent<EditorProps> = (props = {}) => {
  const { currentTab, tab } = useContext(TabContext);
  const { file = {} } = tab.metadata || {};

  const editorState = state.useEditorState();
  const parserState = state.useParserState();

  async function handleEditorDidMount(
    editor: monacoAPI.editor.IStandaloneCodeEditor,
  ) {
    EditorsManager.addEditor(editor, currentTab);
    SpecificationService.parse(editor.getValue(), currentTab);

    // apply save command
    editor.addCommand(
      monacoAPI.KeyMod.CtrlCmd | monacoAPI.KeyCode.KEY_S,
      () => {
        // const editorValue = EditorService.getValue();
        // localStorage.setItem('document', editorValue);
        // state.editor.documentFrom.set('localStorage');
        FilesManager.updateFileContent(file.id, editor.getValue());
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
    // EditorService.updateState({ content: v });
    SpecificationService.parse(v, currentTab).then(parsedSpec => {
      parsedSpec && parserState.parsedSpec.set(parsedSpec);
    })
  }, 625);

  useEffect(() => {
    // on mount
    MonacoService.loadMonaco();
    // on unmount
    return () => {
      EditorsManager.deleteEditor(currentTab);
    }
  }, []);

  if (!editorState.monacoLoaded.get()) {
    return null;
  }

  return (
    <MonacoEditor
      language={file.extension || 'yaml'}
      defaultValue={file.content || sampleSpec}
      theme="asyncapi-theme"
      onMount={handleEditorDidMount}
      onChange={onChange}
      options={{
        wordWrap: 'on',
        smoothScrolling: true,
      }}
      {...props}
    />
  );
};
