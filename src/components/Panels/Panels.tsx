import React from 'react';
import { Split } from "../Split"

import { Panel } from './Panel';

import state from '../../state';

export interface PanelItem {
  id: string;
  direction?: 'horizontal' | 'vertical',
  panels?: string[],
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
      <Split vertical={currentPanel.direction === 'vertical'}>
        {currentPanel.panels.map(panel => {
          return (
            <Split.Pane key={panel} minSize={260} snap>
              <Panels id={panel} />
            </Split.Pane>
          );
        })}
      </Split>
    );
  }

  return (
    <Panel key={id} panelID={id} />
  );
};
