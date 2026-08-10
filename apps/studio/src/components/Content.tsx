import SplitPane from './SplitPane';
import { Editor } from './Editor/Editor';
import { Navigation } from './Navigation';
import { Navigationv3 } from './Navigationv3';
import { Template } from './Template';
import { VisualiserTemplate } from './Visualiser';

import { debounce } from '@/helpers';
import { panelsState, usePanelsState, useDocumentsState } from '@/state';

import { FunctionComponent, useEffect, useLayoutEffect, useState } from 'react';

interface ContentProps {}

export const Content: FunctionComponent<ContentProps> = () => { // eslint-disable-line sonarjs/cognitive-complexity
  const { show, secondaryPanelType } = usePanelsState();
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches);
  const document = useDocumentsState(state => state.documents['asyncapi']?.document) || null;
  const isV3 = document?.version().startsWith('3.');
  const navigationEnabled = show.primarySidebar;
  const editorEnabled = show.primaryPanel;
  const viewEnabled = show.secondaryPanel;
  const viewType = secondaryPanelType === 'avro' ? 'template' : secondaryPanelType;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const handleChange = () => setIsMobile(mediaQuery.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useLayoutEffect(() => {
    if (isMobile && panelsState.getState().show.primarySidebar) {
      panelsState.setState(state => ({
        show: { ...state.show, primarySidebar: false },
      }));
    }
  }, [isMobile]);

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
      {
        isV3 ? <Navigationv3 /> : <Navigation />
      }
      <Editor />
    </SplitPane>
  );

  if (isMobile) {
    const closeNavigation = () => {
      panelsState.setState(state => ({
        show: { ...state.show, primarySidebar: false },
      }));
    };
    let mobileMainPanel = <Editor />;
    if (!editorEnabled && viewEnabled) {
      mobileMainPanel = viewType === 'template' ? <Template /> : <VisualiserTemplate />;
    }

    return (
      <div className="relative flex min-w-0 flex-1 overflow-hidden">
        <div className="flex min-w-0 flex-1 overflow-hidden">
          {mobileMainPanel}
        </div>
        {navigationEnabled && (
          <>
            <button
              type="button"
              aria-label="Close navigation"
              className="absolute inset-0 z-20 bg-black/40"
              onClick={closeNavigation}
            />
            <aside
              className="absolute inset-y-0 left-0 z-30 w-[min(85vw,20rem)] max-w-full overflow-hidden bg-gray-800 shadow-2xl"
            >
              {isV3
                ? <Navigationv3 className="w-full" />
                : <Navigation className="w-full" />}
            </aside>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-1 flex-row relative overflow-hidden">
      <div className="flex min-w-0 flex-1 flex-row relative overflow-hidden">
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
