import React from 'react';

import { TerminalTabs, TerminalTab } from './TerminalTabs';
import { DiagnosticTab, DiagnosticsContent } from './Diagnostics';

interface TerminalProps {}

export const Terminal: React.FunctionComponent<TerminalProps> = () => {
  const tabs: Array<TerminalTab> = [
    {
      name: 'problems',
      tab: <DiagnosticTab />,
      content: <DiagnosticsContent />,
    },
  ];

  return (
    <div className="bg-gray-800 border-t border-gray-700 flex-grow relative h-full overflow-hidden">
      <TerminalTabs tabs={tabs} active="problems" />
    </div>
  );
};
