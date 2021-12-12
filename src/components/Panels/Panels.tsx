import React from 'react';
import { Split } from '../Split';

import { PanelContent } from './Panel';
import { PanelContext } from './PanelContext';

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
              <PanelContext.Provider value={{ currentPanel: currentPanel.id }}>
                <Panels id={panel} panels={panels} />
              </PanelContext.Provider>
            </Split.Pane>
          );
        })}
      </Split>
    );
  }

  return (
    <PanelContext.Provider value={{ currentPanel: currentPanel.id }}>
      <PanelContent />
    </PanelContext.Provider>
  );
};
