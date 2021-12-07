import React from 'react';
import { Allotment } from "allotment";

import { Navigation } from "./Navigation";
import { Panels } from './Panels/Panels';

// import state from '../state';

interface ContentProps {}

export const Content: React.FunctionComponent<ContentProps> = () => { // eslint-disable-line sonarjs/cognitive-complexity
  return (
    <div className="flex flex-1 flex-row relative">
      <Allotment>
        <Allotment.Pane minSize={240} maxSize={360} snap>
          <Navigation />
        </Allotment.Pane>
        <Allotment.Pane minSize={240}>
          <Panels id='root-vertical' />
        </Allotment.Pane>
      </Allotment>
    </div>
  );

  // const sidebarState = state.useSidebarState();

  // const navigationEnabled = sidebarState.panels.navigation.get();
  // const editorEnabled = sidebarState.panels.editor.get();

  // return (
  //   <div className="flex flex-1 flex-row relative">
  //     <Allotment>
  //       {/* <Allotment.Pane minSize={240} snap>
  //         <Navigation />
  //       </Allotment.Pane> */}
  //       <Allotment.Pane minSize={240}>
  //         <Allotment vertical>
  //           <Allotment.Pane>
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