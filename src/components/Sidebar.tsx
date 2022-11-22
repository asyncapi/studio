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
  title: string;
  isActive: () => boolean;
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
      title: 'Navigation',
      isActive: () => sidebarState.panels.navigation.get(),
      icon: <VscListSelection className="w-5 h-5" />,
      tooltip: 'Navigation',
    },
    // editor
    {
      name: 'editor',
      title: 'Editor',
      isActive: () => sidebarState.panels.editor.get(),
      icon: <VscCode className="w-5 h-5" />,
      tooltip: 'Editor',
    },
    // template
    {
      name: 'template',
      title: 'Template',
      isActive: () => sidebarState.panels.view.get() && sidebarState.panels.viewType.get() === 'template',
      icon: <VscOpenPreview className="w-5 h-5" />,
      tooltip: 'HTML preview',
    },
    // visuliser
    {
      name: 'visualiser',
      title: 'Visualiser',
      isActive: () => sidebarState.panels.view.get() && sidebarState.panels.viewType.get() === 'visualiser',
      icon: <VscGraph className="w-5 h-5" />,
      tooltip: 'Blocks visualiser',
    },
    // newFile
    {
      name: 'newFile',
      title: 'New file',
      isActive: () => false,
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
              title={item.title}
              onClick={() => setActiveNav(item.name as NavItemType)}
              className={'flex text-sm focus:outline-none border-box p-2'}
              type="button"
            >
              <div className={item.isActive() ? 'bg-gray-600 p-2 rounded text-white' : 'p-2 text-gray-500 hover:text-white'}>
                {item.icon}
              </div>
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