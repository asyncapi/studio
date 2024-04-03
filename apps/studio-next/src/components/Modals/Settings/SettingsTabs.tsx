import { useState } from 'react';

import type { ReactNode, FunctionComponent } from 'react';

export interface SettingTab {
  name: string;
  tab: ReactNode;
  content: ReactNode;
}

interface SettingTabsProps {
  active: string;
  tabs: Array<SettingTab>;
}

export const SettingsTabs: FunctionComponent<SettingTabsProps> = ({
  active,
  tabs = [],
}) => {
  const [activeTab, setActiveTab] = useState(
    tabs.some(tab => tab.name === active) ? active : tabs[0]?.name
  );
  
  if (tabs.length === 0) {
    return null;
  }

  return (
    <div>
      <div
        className="flex flex-row justify-between items-center border-b border-gray-300 text-white uppercase font-bold text-xs"
      >
        <ul className="flex flex-row">
          {tabs.map(tab => (
            <li
              key={tab.name}
              className="cursor-pointer"
              onClick={() => setActiveTab(tab.name)}
            >
              <div
                className={`p-2 hover:text-pink-500 ${
                  activeTab === tab.name
                    ? 'text-pink-500 border-b-2 border-pink-500'
                    : 'text-gray-500'
                }`}
              >
                {tab.tab}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div
        className="overflow-auto h-64"
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
