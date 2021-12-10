import React from 'react';

import { PanelContent } from './PanelContent';
import { PanelContext } from './PanelContext';

interface PanelProps {
  panelID: string;
}

export const Panel: React.FunctionComponent<PanelProps> = ({
  panelID,
}) => {
  return (
    <PanelContext.Provider value={{ currentPanel: panelID }}>
      <div className="relative h-full min-h-full bg-gray-800">
        <PanelContent />
      </div>
    </PanelContext.Provider>
  );
};
