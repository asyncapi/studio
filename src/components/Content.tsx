import React from 'react';
import SplitPane from 'react-split-pane';

import { Editor } from './Editor/Editor';
import { Navigation } from './Navigation';
import { Template } from './Template';

import { debounce } from '../helpers';
import state from '../state';

interface ContentProps {}

export const Content: React.FunctionComponent<ContentProps> = () => {
  const sidebarState = state.useSidebarState();

  const navigationEnabled = sidebarState.panels.navigation.get();
  const editorEnabled = sidebarState.panels.editor.get();
  const templateEnabled = sidebarState.panels.template.get();

  const navigationAndEditor = (
    <SplitPane
      minSize={220}
      maxSize={360}
      pane1Style={!navigationEnabled ? { width: '0px' } : { overflow: 'auto' }}
      pane2Style={!editorEnabled ? { width: '0px' } : undefined}
      primary={!editorEnabled ? 'second' : 'first'}
      defaultSize={
        parseInt(localStorage.getItem('splitPos:left') || '0', 10) || 220
      }
      onChange={debounce((size: string) => {
        localStorage.setItem('splitPos:left', String(size));
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
          minSize={0}
          pane1Style={
            !navigationEnabled && !editorEnabled ? { width: '0px' } : undefined
          }
          pane2Style={
            !templateEnabled ? { width: '0px' } : { overflow: 'auto' }
          }
          primary={!templateEnabled ? 'second' : 'first'}
          defaultSize={
            parseInt(localStorage.getItem('splitPos:center') || '0', 10) ||
            '55%'
          }
          onChange={debounce((size: string) => {
            localStorage.setItem('splitPos:center', String(size));
          }, 100)}
        >
          {navigationAndEditor}
          <Template />
        </SplitPane>
      </div>
    </div>
  );
};