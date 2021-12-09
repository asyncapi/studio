import React from 'react';

import { PanelContent } from './PanelsContent';
import { NewTab } from './Tabs/NewTab';
import { PanelContext } from './PanelContext';
import { generateUniqueID } from '../../helpers';

function createStartTabs() {
  return [
    {
      name: generateUniqueID(),
      tab: <span>New</span>,
      content: (
        <NewTab />
      ),
      isNewTab: true,
    },
  ];
}

interface PanelProps {
  panelID: string;
}

export const Panel: React.FunctionComponent<PanelProps> = ({
  panelID,
}) => {
  return (
    <PanelContext.Provider value={{
      currentPanel: panelID,
    }}>
      <div className="relative h-full min-h-full bg-gray-800">
        <PanelContent tabs={createStartTabs()} />
      </div>
    </PanelContext.Provider>
  );
};
