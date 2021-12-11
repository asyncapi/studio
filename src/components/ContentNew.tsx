import React, { useEffect, useState } from 'react';
import { Split } from './Split';

import { Panels } from './Panels/Panels';

import { ContextMenu } from "./ContextMenu";

import { PanelsManager, Panel } from '../services';

import state from '../state';

interface ContentProps {}

export const Content: React.FunctionComponent<ContentProps> = () => {
  const sidebarState = state.useSidebarState();
  const activeMenu = sidebarState.activePanel.get();
  const [panels, setPanels] = useState<Panel[]>([]);

  useEffect(() => {
    const listener = PanelsManager.addPanelsListener(newPanels => {
      newPanels && setPanels(newPanels);
    });
    return () => {
      PanelsManager.removePanelsListener(listener)
    }
  }, []);

  return (
    <div className="flex flex-1 flex-row relative bg-gray-800">
      <Split onChange={(e: number[]) => {
        // const navigationEnabled = sidebarState.panels.navigation.get() === true;
        // const toolsEnabled = sidebarState.panels.tools.get() === true;
        // const templatesEnabled = sidebarState.panels.templates.get() === true;

        // if (e[0] === 0 && sidebarState.panels.navigation.get() === true) {
        //   sidebarState.panels.navigation.set(false);
        // } else if (e[0] > 0 && sidebarState.panels.navigation.get() === false) {
        //   sidebarState.panels.navigation.set(true);
        // }
      }}>
        {/* Improve show prop */}
        <Split.Pane 
          key='context-menu' 
          minSize={280} 
          maxSize={360} 
          snap={true}
          show={activeMenu !== false}
        >
          <ContextMenu />
        </Split.Pane>
        <Split.Pane key='content'>
          <Panels id='root' panels={panels} />
        </Split.Pane>
      </Split>
    </div>
  );
};