import React from 'react';

import { TerminalTabs, TerminalTab } from './TerminalTabs';
import { ProblemsTab, ProblemsTabContent } from './ProblemsTab';

interface TerminalProps {}

export const Terminal: React.FunctionComponent<TerminalProps> = () => {
  const tabs: Array<TerminalTab> = [
    {
      name: 'problems',
      tab: <ProblemsTab />,
      content: <ProblemsTabContent />,
    },
  ];

  return (
    <div className="bg-gray-900 border-t border-gray-700 flex-grow relative h-full overflow-hidden">
      <TerminalTabs tabs={tabs} active="problems" />
    </div>
  );
};
