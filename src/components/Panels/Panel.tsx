import React from 'react';
// import { VscCode } from 'react-icons/vsc';

import { PanelTab, PanelTabs } from './PanelsTabs';
// import { MonacoWrapper } from '../Editor';
// import { HTMLWrapper } from '../Template';
import { NewTab } from './NewTab';
import { PanelContext } from './PanelContext';
import { generateUniqueID } from '../../helpers';

// import state from '../../state';

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
        <PanelTabs tabs={createStartTabs()} />
      </div>
    </PanelContext.Provider>
  );
};
