import React, { useEffect, useState } from 'react';
import { Split } from './Split';

import { Panels } from './Panels/Panels';
import { Orientation } from './Split/sash';

import { ContextMenu } from "./ContextMenu";

import { PanelsManager, Panel } from '../services';

import state from '../state';

const startupPanels: Panel[] = [
  {
    id: 'root',
    direction: Orientation.Vertical,
    panels: ['group-1'],
  },
  {
    id: 'group-1',
    direction: Orientation.Horizontal,
    panels: ['panel-1-group', 'panel-2-group'],
    parent: 'root',
  },
  {
    id: 'panel-1-group',
    direction: Orientation.Vertical,
    panels: ['panel-1'],
    parent: 'group-1',
  },
  {
    id: 'panel-2-group',
    direction: Orientation.Vertical,
    panels: ['panel-2'],
    parent: 'group-1',
  },
  {
    id: 'panel-1',
    tabs: [PanelsManager.createFileTab()],
    parent: 'panel-1-group',
  },
  {
    id: 'panel-2',
    tabs: [PanelsManager.createToolTab('html')!],
    parent: 'panel-2-group',
  },
];

interface ContentProps {}

export const Content: React.FunctionComponent<ContentProps> = () => {
  const sidebarState = state.useSidebarState();
  const activeMenu = sidebarState.activePanel.get();
  const [panels, setPanels] = useState(startupPanels)

  useEffect(() => {
    PanelsManager.panels = startupPanels.reduce((acc, panel) => {
      acc.set(panel.id, panel);
      return acc;
    }, new Map())
    const listener = PanelsManager.addPanelsListener(p => {
      p && setPanels(p);
    })
    return () => {
      PanelsManager.removePanelsListener(listener)
    }
  }, []);

  return (
    <div className="flex flex-1 flex-row relative">
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