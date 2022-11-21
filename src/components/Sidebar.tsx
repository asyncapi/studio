import React from 'react';
import { VscListSelection, VscCode, VscOpenPreview, VscGraph, VscNewFile } from 'react-icons/vsc';

import { Tooltip } from './common';
import { SettingsModal } from './Modals/Settings/SettingsModal';

import state from '../state';

type NavItemType = 'navigation' | 'editor' | 'template' | 'visualiser';

function setActiveNav(navItem: NavItemType) {
  const panels = state.sidebar.panels;
  const panelsState = panels.get();

  const newState = {
    ...panelsState,
  };

  if (navItem === 'template' || navItem === 'visualiser') {
    // on current type
    if (newState.viewType === navItem) {
      newState.view = !newState.view;
    } else {
      newState.viewType = navItem;
      if (newState.view === false) {
        newState.view = true;
      }
    }
  } else {
    newState[`${navItem}`] = !newState[`${navItem}`];
  }

  if (newState.navigation && !newState.editor && !newState.view) {
    panels.set({
      ...newState,
      view: true,
    });
    return;
  }
  if (!Object.values(newState).some(itemNav => itemNav === true)) {
    panels.set({
      ...newState,
      view: true,
    });
    return;
  }

  panels.set(newState);
}

interface NavItem {
  name: string;
  state: () => boolean;
  icon: React.ReactNode;
  tooltip: React.ReactNode;
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
      state: () => sidebarState.panels.navigation.get(),
      icon: <VscListSelection className="w-5 h-5" />,
      tooltip: 'Navigation',
    },
    // editor
    {
      name: 'editor',
      state: () => sidebarState.panels.editor.get(),
      icon: <VscCode className="w-5 h-5" />,
      tooltip: 'Editor',
    },
    // template
    {
      name: 'template',
      state: () => sidebarState.panels.view.get() && sidebarState.panels.viewType.get() === 'template',
      icon: <VscOpenPreview className="w-5 h-5" />,
      tooltip: 'HTML preview',
    },
    // visuliser
    {
      name: 'visualiser',
      state: () => sidebarState.panels.view.get() && sidebarState.panels.viewType.get() === 'visualiser',
      icon: <VscGraph className="w-5 h-5" />,
      tooltip: 'Blocks visualiser',
    },
    // newFile
    {
      name: 'newFile',
      state: () => false,
      icon: <VscNewFile className="w-5 h-5" />,
      tooltip: 'New file',
    },
  ];

  return (
    <div className="flex flex-col bg-gray-800 shadow-lg border-r border-gray-700 justify-between">
      <div className="flex flex-col">
        {navigation.map(item => (
          <Tooltip content={item.tooltip} placement='right' hideOnClick={true} key={item.name}>
            <button
              title={(item.name.charAt(0).toUpperCase() + item.name.slice(1))}
              onClick={() => setActiveNav(item.name as NavItemType)}
              className={`flex text-sm border-l-2  ${
                item.state()
                  ? 'text-white hover:text-gray-500 border-white'
                  : 'text-gray-500 hover:text-white border-gray-800'
              } focus:outline-none border-box p-4`}
              type="button"
            >
              {item.icon}
            </button>
          </Tooltip>
        ))}
      </div>
      <div className="flex flex-col">
        <SettingsModal />
      </div>
    </div>
  );
};