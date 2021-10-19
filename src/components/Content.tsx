import React from 'react';
import SplitPane from 'react-split-pane';

import { Editor } from './Editor/Editor';
import { Navigation } from './Navigation';
import { Template } from './Template';

import { debounce } from '../helpers';
import state from '../state';

interface ContentProps {}

export const Content: React.FunctionComponent<ContentProps> = () => { // eslint-disable-line sonarjs/cognitive-complexity
  const sidebarState = state.useSidebarState();

  const navigationEnabled = sidebarState.panels.navigation.get();
  const editorEnabled = sidebarState.panels.editor.get();
  const templateEnabled = sidebarState.panels.template.get();

  const splitPaneLeft = 'splitPane:left';
  const splitPaneRight = 'splitPane:right';

  const localStorageLeftPaneSize = parseInt(localStorage.getItem(splitPaneLeft) || '0', 10) || 220;
  const localStorageRightPaneSize = parseInt(localStorage.getItem(splitPaneRight) || '0', 10) || '55%';

  const secondPaneSize = navigationEnabled && !editorEnabled ? localStorageLeftPaneSize : localStorageRightPaneSize;
  const secondPaneMaxSize = navigationEnabled && !editorEnabled ? 360 : '100%';

  const navigationAndEditor = (
    <SplitPane
      minSize={220}
      maxSize={360}
      pane1Style={navigationEnabled ? { overflow: 'auto' } : { width: '0px' }}
      pane2Style={editorEnabled ? undefined : { width: '0px' }}
      primary={editorEnabled ? 'first' : 'second'}
      defaultSize={localStorageLeftPaneSize}
      onChange={debounce((size: string) => {
        localStorage.setItem(splitPaneLeft, String(size));
      }, 100)}
    >
      <Navigation />
      <Editor />
    </SplitPane>
  );

  return (
    <div className="flex flex-1 flex-row relative">
      <div className="flex flex-1 flex-row relative">
        <SplitPane
          size={templateEnabled ? secondPaneSize : 0}
          minSize={0}
          maxSize={secondPaneMaxSize}
          pane1Style={
            navigationEnabled || editorEnabled ? undefined : { width: '0px' }
          }
          pane2Style={
            templateEnabled ? { overflow: 'auto' } : { width: '0px' }
          }
          primary={templateEnabled ? 'first' : 'second'}
          defaultSize={localStorageRightPaneSize}
          onChange={debounce((size: string) => {
            localStorage.setItem(splitPaneRight, String(size));
          }, 100)}
        >
          {navigationAndEditor}
          <Template />
        </SplitPane>
      </div>
    </div>
  );
};