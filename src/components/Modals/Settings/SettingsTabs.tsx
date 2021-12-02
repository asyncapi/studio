import React, { useState } from 'react';

export interface SettingTab {
  name: string;
  tab: React.ReactNode;
  content: React.ReactNode;
}

interface SettingTabsProps {
  tabs: Array<SettingTab>;
  active?: string;
}

export const SettingsTabs: React.FunctionComponent<SettingTabsProps> = ({
  tabs = [],
  active = '',
}) => {
  const [activeTab, setActiveTab] = useState(active || tabs[0]?.name);

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
