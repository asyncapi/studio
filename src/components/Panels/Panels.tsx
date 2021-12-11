import React from 'react';
import { Split } from "../Split"

import { Panel } from './Panel';

import { Panel as PanelItem } from '../../services';

interface PanelsProps {
  id: string;
  panels: PanelItem[];
}

export const Panels: React.FunctionComponent<PanelsProps> = ({
  id,
  panels,
}) => {
  const currentPanel = panels.find(p => p.id === id);
  if (!currentPanel) {
    return null;
  }

  if (Array.isArray(currentPanel.panels)) {
    return (
      <Split vertical={currentPanel.direction === 'VERTICAL'} show={currentPanel.visible !== false}>
        {currentPanel.panels.map(panel => {
          const p = panels.find(p => p.id === panel);
          return (
            <Split.Pane key={panel} minSize={260} snap show={p!.visible !== false}>
              <Panels id={panel} panels={panels} />
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
