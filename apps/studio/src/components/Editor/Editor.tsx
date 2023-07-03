import React from 'react';

import SplitPane from '../SplitPane';
import { EditorSidebar } from './EditorSidebar';
import MonacoWrapper from './MonacoWrapper';
import { useOtherState } from '../../state';
import { Terminal } from '../Terminal';
// import { Terminal } from '../Terminal/Terminal';


export interface EditorProps {}

export const Editor: React.FunctionComponent<EditorProps> = () => {

  const editorHeight = useOtherState(state => state.editorHeight)

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
