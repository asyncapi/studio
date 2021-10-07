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
      pane1Style={navigationEnabled ? { overflow: 'auto' } : { width: '0px' }}
      pane2Style={editorEnabled ? undefined : { width: '0px' }}
      primary={editorEnabled ? 'first' : 'second'}
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
            navigationEnabled || editorEnabled ? undefined : { width: '0px' }
          }
          pane2Style={
            templateEnabled ? { overflow: 'auto' } : { width: '0px' }
          }
          primary={templateEnabled ? 'first' : 'second'}
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