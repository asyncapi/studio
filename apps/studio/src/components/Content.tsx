import { useEffect, useState } from "react";
import { usePanelsState } from "../states"
import { Editor } from "./Editor";
import SplitPane from "./SplitPane";
import { Navigation } from "./Navigation";

interface ContentProps {}

const Content : React.FC<ContentProps> = () => {
  const { show, secondaryPanelType } = usePanelsState();
  
  const navigationEnabled = show.primarySidebar;
  const editorEnabled = show.primaryPanel;
  const viewEnabled = show.secondaryPanel;
  const viewType = secondaryPanelType;

  const splitPosLeft = 'splitPos:left';
  const splitPosRight = 'splitPos:right';

  const [localStorageLeftPaneSize, setLocalStorageLeftPaneSize] = useState<number | string >('220px');
  const [localStorageRightPaneSize, setLocalStorageRightPaneSize] = useState<number | string >('55%');

  useEffect(() => {
    const leftPaneSize = localStorage.getItem(splitPosLeft);
    const rightPaneSize = localStorage.getItem(splitPosRight);

    if (leftPaneSize) {
      setLocalStorageLeftPaneSize(parseInt(leftPaneSize, 10));
    }

    if (rightPaneSize) {
      setLocalStorageRightPaneSize(parseInt(rightPaneSize, 10));
    }
  }, []); 

  const secondPaneSize = navigationEnabled && !editorEnabled ? localStorageLeftPaneSize : localStorageRightPaneSize;
  const secondPaneMaxSize = navigationEnabled && !editorEnabled ? '100%' : '100%';


  const navigationAndEditor = (
    <SplitPane
      minSize={220}
      maxSize={360}
      pane1Style={navigationEnabled ? { overflow: 'auto' } : { width: '0px' }}
      pane2Style={editorEnabled ? undefined : { width: '0px' }}
      primary={editorEnabled ? 'first' : 'second'}
      defaultSize={localStorageLeftPaneSize}
      // onChange={debounce((size: string) => {
      //   localStorage.setItem(splitPosLeft, String(size));
      // }, 100)}
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
          // onChange={debounce((size: string) => {
          //   localStorage.setItem(splitPosRight, String(size));
          // }, 100)}
        >
          {navigationAndEditor}
          {/* {viewType === 'template' && <Template />} */}
          {/* {viewType === 'visualiser' && <VisualiserTemplate />} */}
        </SplitPane> 
      </div>
    </div>
  );
};

export default Content;