import React from 'react';
import { StateMethods } from '@hookstate/core';
import { VscListSelection, VscCode, VscOpenPreview } from 'react-icons/vsc';

import state from '../state';

interface NavItem {
  name: string;
  state: StateMethods<boolean>;
  icon: React.ReactNode;
}

interface SidebarProps {}

export const Sidebar: React.FunctionComponent<SidebarProps> = () => {
  const sidebarState = state.useSidebarState();

  if (sidebarState.show.get() === false) {
    return null;
  }

  const navigation: NavItem[] = [
    // navigation
    {
      name: 'navigation',
      state: sidebarState.panels.navigation,
      icon: <VscListSelection className="w-5 h-5" />,
    },
    // editor
    {
      name: 'editor',
      state: sidebarState.panels.editor,
      icon: <VscCode className="w-5 h-5" />,
    },
    // template
    {
      name: 'template',
      state: sidebarState.panels.template,
      icon: <VscOpenPreview className="w-5 h-5" />,
    },
  ];

  return (
    <div className="flex flex-col flex-none bg-gray-800 shadow-lg border-r border-gray-700 justify-between">
      <div className="flex flex-col">
        {navigation.map(item => (
          <button
            key={item.name}
            onClick={() => item.state.set(v => !v)}
            className={`flex text-sm border-l-2  ${
              item.state.get()
                ? 'text-white hover:text-gray-500 border-white'
                : 'text-gray-500 hover:text-white border-gray-800'
            } focus:outline-none border-box p-4`}
            type="button"
          >
            {item.icon}
          </button>
        ))}
      </div>
    </div>
  );
};
