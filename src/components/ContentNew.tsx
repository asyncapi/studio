import React from 'react';
// import { Allotment,  } from 'allotment';
import { Split } from './Split';

import { Navigation } from './Navigation';
import { Panels } from './Panels/Panels';

import state from '../state';

interface ContentProps {}

export const Content: React.FunctionComponent<ContentProps> = () => {
  const sidebarState = state.useSidebarState();
  const navigationEnabled = sidebarState.panels.navigation.get();

  return (
    <div className="flex flex-1 flex-row relative">
      <Split onChange={(e) => {
        if (e[0] === 0 && sidebarState.panels.navigation.get() === true) {
          sidebarState.panels.navigation.set(false);
        } else if (e[0] > 0 && sidebarState.panels.navigation.get() === false) {
          sidebarState.panels.navigation.set(true);
        }
      }}>
        {/* Improve show prop */}
        <Split.Pane key='navigation' minSize={240} maxSize={360} snap show={navigationEnabled}>
          <Navigation />
        </Split.Pane>
        <Split.Pane key='content'>
          <Panels id='root-vertical' />
        </Split.Pane>
      </Split>
    </div>
  );
};