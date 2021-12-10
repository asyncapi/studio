import React, { useEffect, useState } from 'react';
import { Split } from './Split';

import { Navigation } from './Navigation';
import { Panels } from './Panels/Panels';
import { Orientation } from './Split/sash';

import { PanelsManager, Panel, PanelTabType } from '../services';

import state from '../state';
import { generateUniqueID } from '../helpers';
import { NewTab } from './Panels/Tabs';

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
    tabs: [
      {
        id: generateUniqueID(),
        type: PanelTabType.EMPTY,
        tab: <span className="italic">Empty</span>,
        content: (
          <NewTab />
        ),
      }
    ],
    parent: 'panel-1-group',
  },
  {
    id: 'panel-2',
    tabs: [
      {
        id: generateUniqueID(),
        type: PanelTabType.EMPTY,
        tab: <span className="italic">Empty</span>,
        content: (
          <NewTab />
        ),
      }
    ],
    parent: 'panel-2-group',
  },
];

interface ContentProps {}

export const Content: React.FunctionComponent<ContentProps> = () => {
  const sidebarState = state.useSidebarState();
  const navigationEnabled = sidebarState.panels.navigation.get();

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
          <Panels id='root' panels={panels} />
        </Split.Pane>
      </Split>
    </div>
  );
};