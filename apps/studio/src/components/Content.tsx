import SplitPane from './SplitPane';
import { Editor } from './Editor/Editor';
import { Navigation } from './Navigation';
import { Navigationv3 } from './Navigationv3';
import { Template } from './Template';
import { VisualiserTemplate } from './Visualiser';

import { debounce } from '@/helpers';
import { usePanelsState, useDocumentsState } from '@/state';

import React, { FunctionComponent, useMemo, useCallback } from 'react';

interface ContentProps {}

export const Content: FunctionComponent<ContentProps> = React.memo(() => {
  const { show, secondaryPanelType } = usePanelsState();
  const document =
    useDocumentsState(state => state.documents['asyncapi']?.document) || null;

  const isV3 = document?.version() === '3.0.0';
  const navigationEnabled = show.primarySidebar;
  const editorEnabled = show.primaryPanel;
  const viewEnabled = show.secondaryPanel;
  const viewType = secondaryPanelType;

  const splitPosLeft = 'splitPos:left';
  const splitPosRight = 'splitPos:right';

  const localStorageLeftPaneSize = useMemo(
    () => parseInt(localStorage.getItem(splitPosLeft) || '0', 10) || 220,
    [splitPosLeft]
  );

  const localStorageRightPaneSize = useMemo(
    () => parseInt(localStorage.getItem(splitPosRight) || '0', 10) || '55%',
    [splitPosRight]
  );

  const secondPaneSize = useMemo(() => {
    if (!navigationEnabled && !editorEnabled) {
      return 0;
    }
    return navigationEnabled && !editorEnabled
      ? localStorageLeftPaneSize
      : localStorageRightPaneSize;
  }, [
    navigationEnabled,
    editorEnabled,
    localStorageLeftPaneSize,
    localStorageRightPaneSize,
  ]);

  const secondPaneMaxSize = useMemo(
    () => (navigationEnabled && !editorEnabled ? 360 : '100%'),
    [navigationEnabled, editorEnabled]
  );

  const handleLeftPaneResize = useCallback(
    (size: string) => {
      localStorage.setItem(splitPosLeft, String(size));
    },
    [splitPosLeft]
  );

  const handleRightPaneResize = useCallback(
    (size: string) => {
      localStorage.setItem(splitPosRight, String(size));
    },
    [splitPosRight]
  );

  const debouncedLeftResize = useMemo(
    () => debounce(handleLeftPaneResize, 100),
    [handleLeftPaneResize]
  );

  const debouncedRightResize = useMemo(
    () => debounce(handleRightPaneResize, 100),
    [handleRightPaneResize]
  );

  const navigationAndEditor = useMemo(
    () => (
      <SplitPane
        minSize={220}
        maxSize={360}
        pane1Style={
          navigationEnabled ? { overflow: 'auto' } : { width: '0px' }
        }
        pane2Style={
          editorEnabled ? undefined : { width: '0px' }
        }
        primary="first"
        defaultSize={localStorageLeftPaneSize}
        onChange={debouncedLeftResize}
      >
        {isV3 ? <Navigationv3 /> : <Navigation />}
        <Editor />
      </SplitPane>
    ),
    [
      navigationEnabled,
      editorEnabled,
      localStorageLeftPaneSize,
      isV3,
      debouncedLeftResize,
    ]
  );

  const leftPaneStyle = useMemo(
    () =>
      navigationEnabled || editorEnabled
        ? undefined
        : { width: '0px' },
    [navigationEnabled, editorEnabled]
  );

  const rightPaneStyle = useMemo(
    () =>
      viewEnabled
        ? { overflow: 'auto' }
        : { width: '0px' },
    [viewEnabled]
  );

  return (
    <div className="flex flex-1 flex-row relative">
      <div className="flex flex-1 flex-row relative">
        <SplitPane
          size={viewEnabled ? secondPaneSize : 0}
          minSize={0}
          maxSize={secondPaneMaxSize}
          pane1Style={leftPaneStyle}
          pane2Style={rightPaneStyle}
          primary={viewEnabled ? 'first' : 'second'}
          defaultSize={localStorageRightPaneSize}
          onChange={debouncedRightResize}
        >
          {navigationAndEditor}
          {viewType === 'template' && <Template />}
          {viewType === 'visualiser' && <VisualiserTemplate />}
        </SplitPane>
      </div>
    </div>
  );
});
