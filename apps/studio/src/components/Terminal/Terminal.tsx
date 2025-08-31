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
    <div className="bg-slate-200 dark:bg-gray-800 border-t border-black dark:border-gray-700 flex-grow relative h-full overflow-hidden" id="terminal">
      <TerminalTabs tabs={tabs} active="problems" />
    </div>
  );
};
