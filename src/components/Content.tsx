import SplitPane from './SplitPane';
import { Editor } from './Editor/Editor';
import { Navigation } from './Navigation';
import { Template } from './Template';
import { VisualiserTemplate } from './Visualiser';

import { debounce } from '../helpers';
import { usePanelsState } from '../state';

import type { FunctionComponent } from 'react';

interface ContentProps {}

export const Content: FunctionComponent<ContentProps> = () => { // eslint-disable-line sonarjs/cognitive-complexity
  const { show, secondaryPanelType } = usePanelsState();

  const navigationEnabled = show.primarySidebar;
  const editorEnabled = show.primaryPanel;
  const viewEnabled = show.secondaryPanel;
  const viewType = secondaryPanelType;

  const splitPosLeft = 'splitPos:left';
  const splitPosRight = 'splitPos:right';

  const localStorageLeftPaneSize = parseInt(localStorage.getItem(splitPosLeft) || '0', 10) || 220;
  const localStorageRightPaneSize = parseInt(localStorage.getItem(splitPosRight) || '0', 10) || '55%';

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
        localStorage.setItem(splitPosLeft, String(size));
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
          size={viewEnabled ? secondPaneSize : 0}
          minSize={0}
          maxSize={secondPaneMaxSize}
          pane1Style={
            navigationEnabled || editorEnabled ? undefined : { width: '0px' }
          }
          pane2Style={
            viewEnabled ? { overflow: 'auto' } : { width: '0px' }
          }
          primary={viewEnabled ? 'first' : 'second'}
          defaultSize={localStorageRightPaneSize}
          onChange={debounce((size: string) => {
            localStorage.setItem(splitPosRight, String(size));
          }, 100)}
        >
          {navigationAndEditor}
          {viewType === 'template' && <Template />}
          {viewType === 'visualiser' && <VisualiserTemplate />}
        </SplitPane> 
      </div>
    </div>
  );
};