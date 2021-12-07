import React from 'react';
// import { VscCode } from 'react-icons/vsc';

import { PanelTab, PanelTabs } from './PanelsTabs';
// import { MonacoWrapper } from '../Editor';
// import { HTMLWrapper } from '../Template';
import { NewTab } from './NewTab';
import { PanelContext } from './PanelContext';
import { generateUniqueID } from '../../helpers';

// import state from '../../state';

const newTabID = generateUniqueID();
const startTabs: Array<PanelTab> = [
  {
    name: newTabID,
    tab: <span>New</span>,
    content: (
      <NewTab />
    ),
    isNewTab: true,
  },
  // {
  //   name: 'editor',
  //   tab: (
  //     <span>Editor</span>
  //   ),
  //   content: (
  //     <MonacoWrapper />
  //   ),
  // },
  // {
  //   name: 'html',
  //   tab: <span>HTML</span>,
  //   content: (
  //     <HTMLWrapper />
  //   ),
  // },
];

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
      <div className="h-full min-h-full bg-gray-800">
        <PanelTabs tabs={startTabs} />
      </div>
    </PanelContext.Provider>
  );
};
