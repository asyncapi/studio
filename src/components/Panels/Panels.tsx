import React from 'react';
import { Allotment } from "allotment";

import { Panel } from "./Panel";

import state from '../../state';

export interface PanelItem {
  id?: string;
  direction?: 'horizontal' | 'vertical',
  panels?: string[],
  parent?: string;
}

interface PanelsProps {
  id: string;
}

export const Panels: React.FunctionComponent<PanelsProps> = ({
  id,
}) => {
  const panelsState = state.usePanelsState();
  const panels = panelsState.panels.get();
  const currentPanel = panels.find(p => p.id === id) as PanelItem;

  if (!currentPanel) {
    return null;
  }

  if (Array.isArray(currentPanel.panels)) {
    return (
      <Allotment vertical={currentPanel.direction === 'vertical'}>
        {currentPanel.panels.map((panel, idx) => {
          // const foundedPanel = panels.find(p => p.id === panel);
          // // console.log(foundedPanel);
          // if (!foundedPanel) {
          //   console.log(foundedPanel);
          //   return null;
          // }
          return (
            <Allotment.Pane key={panel} minSize={260} snap>
              <Panels id={panel} />
            </Allotment.Pane>
          );
        })}
      </Allotment>
    );
  }

  return (
    <Panel key={id} panelID={id} />
  );

  // return (
  //   <div className="flex flex-1 flex-row relative">
  //     <Allotment>
  //       {/* <Allotment.Pane minSize={240} snap>
  //         <Navigation />
  //       </Allotment.Pane> */}
  //       <Allotment.Pane>
  //         <Allotment>
  //           <Allotment.Pane minSize={240} snap>
  //             <Panel />
  //           </Allotment.Pane>
  //           <Allotment.Pane>
  //             <Panel />
  //           </Allotment.Pane>
  //         </Allotment>
  //       </Allotment.Pane>
  //       {/* <Allotment.Pane>
  //         <Allotment vertical>
  //           <Allotment.Pane>
  //             <Panel />
  //           </Allotment.Pane>
  //           <Allotment.Pane>
  //             <Panel />
  //           </Allotment.Pane>
  //         </Allotment>
  //       </Allotment.Pane> */}
  //     </Allotment>
  //   </div>
  // );

  // return (
  //   <div className="flex flex-1 flex-row relative">
  //     <div className="flex flex-1 flex-row relative">

  //       {newFileEnabled && <NewFile />}

  //       {!newFileEnabled && 
  //         <SplitPane
  //           size={viewEnabled ? secondPaneSize : 0}
  //           minSize={0}
  //           maxSize={secondPaneMaxSize}
  //           pane1Style={
  //             navigationEnabled || editorEnabled ? undefined : { width: '0px' }
  //           }
  //           pane2Style={
  //             viewEnabled ? { overflow: 'auto' } : { width: '0px' }
  //           }
  //           primary={viewEnabled ? 'first' : 'second'}
  //           defaultSize={localStorageRightPaneSize}
  //           onChange={debounce((size: string) => {
  //             localStorage.setItem(splitPosRight, String(size));
  //           }, 100)}
  //         >
  //           {navigationAndEditor}
  //           {viewType === 'template' && <Template />}
  //           {viewType === 'visualiser' && <Visualiser />}
  //         </SplitPane> 
  //       }
  //     </div>
  //   </div>
  // );
};
