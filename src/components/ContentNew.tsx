import React, { useEffect, useRef } from 'react';
import { Allotment,  } from "allotment";

import { Navigation } from "./Navigation";
import { Panels } from './Panels/Panels';

import state from '../state';

interface ContentProps {}

export const Content: React.FunctionComponent<ContentProps> = () => {
  const sidebarState = state.useSidebarState();
  const navigationEnabled = sidebarState.panels.navigation.get();

  return (
    <div className="flex flex-1 flex-row relative">
      <Allotment>
        {navigationEnabled && (
          <Allotment.Pane key='navigation' minSize={240} maxSize={360} snap>
            <Navigation />
          </Allotment.Pane>
        )}
        <Allotment.Pane key='content'>
          <Panels id='root-vertical' />
        </Allotment.Pane>
      </Allotment>
    </div>
  );
};