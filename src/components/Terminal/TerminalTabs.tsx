import React, { useState } from 'react';

import { TerminalInfo } from './TerminalInfo';
import { otherState } from '../../state';

export interface TerminalTab {
  name: string;
  tab: React.ReactNode;
  content: React.ReactNode;
}

interface TerminalTabsProps {
  tabs: Array<TerminalTab>;
  active?: string;
}

export const TerminalTabs: React.FunctionComponent<TerminalTabsProps> = ({
  tabs = [],
  active = 0,
}) => {
  const [activeTab, setActiveTab] = useState(active);
  if (tabs.length === 0) {
    return null;
  }

  return (
    <div>
      <div
        className="flex flex-row justify-between items-center px-2 border-b border-gray-700 text-white uppercase font-bold text-xs cursor-pointer"
        onClick={e => {
          const clientRects = e.currentTarget.parentElement?.parentElement?.getClientRects()[0];
          if (!clientRects) return;

          const height = clientRects.height;
          const calc160px = 'calc(100% - 160px)';
          const calc36px = 'calc(100% - 36px)';

          const prevHeight = otherState.getState().editorHeight;
          const newHeight =
            height < 50 ? calc160px : calc36px;
          if (
            prevHeight === calc160px &&
            newHeight === calc160px
          ) {
            return 'calc(100% - 161px)';
          }
          if (
            prevHeight === calc36px &&
            newHeight === calc36px
          ) {
            return 'calc(100% - 37px)';
          }

          otherState.setState({ editorHeight: newHeight });
        }}
      >
        <ul className="flex flex-row">
          {tabs.map(tab => (
            <li
              key={tab.name}
              className="px-2 cursor-pointer"
              onClick={() => setActiveTab(tab.name)}
            >
              <div
                className={`py-2 hover:text-white ${
                  activeTab === tab.name
                    ? 'text-white border-b border-white'
                    : 'text-gray-500'
                }`}
              >
                {tab.tab}
              </div>
            </li>
          ))}
        </ul>
        <TerminalInfo />
      </div>
      <div
        className="absolute overflow-auto h-auto bottom-0 right-0 left-0"
        style={{ top: '36px' }}
      >
        <ul>
          {tabs.map(tab => (
            <li
              key={tab.name}
              className={`${activeTab === tab.name ? 'block' : 'hidden'}`}
            >
              {tab.content}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
