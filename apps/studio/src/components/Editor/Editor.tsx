import React from 'react';

import SplitPane from '../SplitPane';
import { EditorSidebar } from './EditorSidebar';
import { MonacoWrapper } from './MonacoWrapper';
import { Terminal } from '../Terminal/Terminal';

import { useOtherState } from '../../state';

export interface EditorProps {}

export const Editor: React.FunctionComponent<EditorProps> = () => {
  const editorHeight = useOtherState(state => state.editorHeight);

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
          <EditorSidebar />
          <MonacoWrapper />
        </div>
        <Terminal />
      </SplitPane>
    </div>
  );
};
