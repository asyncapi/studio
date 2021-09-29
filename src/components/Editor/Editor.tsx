import React from 'react';
import SplitPane from 'react-split-pane';

import { MonacoWrapper } from './MonacoWrapper';

import state from '../../state';

export interface EditorProps {}

export const Editor: React.FunctionComponent<EditorProps> = props => {
  const editorState = state.useEditorState();
  const editorHeight = editorState.height.get();

  return (
    <div className="flex flex-1 overflow-hidden">
      <SplitPane
        split="horizontal"
        minSize={29}
        maxSize={-36}
        size={editorHeight}
        defaultSize={editorHeight}
      >
        <div className="flex flex-1 flex-col h-full overflow-hidden">
          <MonacoWrapper />
        </div>
      </SplitPane>
    </div>
  );
};
