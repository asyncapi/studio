import React from 'react';
import { VscCode } from 'react-icons/vsc';

import { PanelTab, PanelTabs } from './PanelsTabs';
import { MonacoWrapper } from '../Editor';
import { HTMLWrapper } from '../Template';

// import state from '../../state';

interface PanelContentProps {}

export const PanelContent: React.FunctionComponent<PanelContentProps> = () => {
  const tabs: Array<PanelTab> = [
    {
      name: 'editor',
      tab: (
        <span>Editor</span>
      ),
      content: (
        <MonacoWrapper />
      ),
    },
    {
      name: 'html',
      tab: <span>HTML</span>,
      content: (
        <HTMLWrapper />
      ),
    },
  ];

  return (
    <div className="h-full min-h-full bg-gray-800">
      <PanelTabs tabs={tabs} />
    </div>
  );
};
