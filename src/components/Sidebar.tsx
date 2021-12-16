import React from 'react';
import { VscListSelection, VscCode, VscOpenPreview, VscGraph, VscNewFile } from 'react-icons/vsc';
import ReactTooltip from 'react-tooltip';

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
    (newState as any)[String(navItem)] = !(newState as any)[String(navItem)];
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
      icon: <VscListSelection  data-tip="Navigation" className="w-5 h-5 " />,
    },
    // editor
    {
      name: 'editor',
      state: () => sidebarState.panels.editor.get(),
      icon: <VscCode data-tip="Code Editor" className="w-5 h-5" />,
    },
    // template
    {
      name: 'template',
      state: () => sidebarState.panels.view.get() && sidebarState.panels.viewType.get() === 'template',
      icon: <VscOpenPreview data-tip="Documentation" className="w-5 h-5" />,
    },
    // visuliser
    {
      name: 'visualiser',
      state: () => sidebarState.panels.view.get() && sidebarState.panels.viewType.get() === 'visualiser',
      icon: <VscGraph data-tip="Visualiser" className="w-5 h-5" />,
    },
    // newFile
    {
      name: 'newFile',
      state: () => sidebarState.panels.newFile.get(),
      icon: <VscNewFile data-tip="Explore Templates" className="w-5 h-5" />,
    },
  ];

  return (
    <div className="flex flex-col bg-gray-800 shadow-lg border-r border-gray-700 justify-between">
      <div className="flex flex-col">
        {navigation.map(item => (
          <button
            key={item.name}
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
        ))}
      </div>
      <div className="flex flex-col">
        <SettingsModal />
      </div>
      <ReactTooltip effect='solid' backgroundColor='#374151' arrowColor='#374151' className="text-xs"  />
    </div>
  );
};