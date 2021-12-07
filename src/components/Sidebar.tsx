import React from 'react';
import { VscListSelection, VscCode, VscOpenPreview, VscGraph, VscAdd } from 'react-icons/vsc';
import { PanelsManager } from '../services';

import state from '../state';
import { usePanelsState } from '../state/panels';

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

interface SidebarItemProps {
  name: string;
  icon: React.ReactNode;
}

const SidebarItem: React.FunctionComponent<SidebarItemProps> = ({
  name,
  icon,
}) => {
  const panelsState = usePanelsState();
  const activePanel = panelsState.activePanel.get();

  return (
    <button
      onClick={() => PanelsManager.addNewTool(activePanel, name)}
      className='flex text-sm text-gray-500 hover:text-white focus:outline-none border-box p-4'
      type="button"
    >
      <div className="relative">
        <div>
          {icon}
        </div>
        <div className="absolute -bottom-2 -left-2 w-3.5 h-3.5 bg-pink-500 rounded-full text-white">
          <div className="flex h-full w-full justify-center items-center">
            <VscAdd className="w-2.5 h-2.5" />
          </div>
        </div>
      </div>
    </button>
  );
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
      icon: <VscListSelection className="w-5 h-5" />,
    },
    // // editor
    // {
    //   name: 'editor',
    //   state: () => sidebarState.panels.editor.get(),
    //   icon: <VscCode className="w-5 h-5" />,
    // },
    // // template
    // {
    //   name: 'template',
    //   state: () => sidebarState.panels.view.get() && sidebarState.panels.viewType.get() === 'template',
    //   icon: <VscOpenPreview className="w-5 h-5" />,
    // },
    // // visuliser
    // {
    //   name: 'visualiser',
    //   state: () => sidebarState.panels.view.get() && sidebarState.panels.viewType.get() === 'visualiser',
    //   icon: <VscGraph className="w-5 h-5" />,
    // },
    // {
    //   name: 'newFile',
    //   state: () => sidebarState.panels.newFile.get(),
    //   icon: <VscNewFile className="w-5 h-5" />,
    // },
  ];

  const tools: SidebarItemProps[] = [
    {
      name: 'editor',
      icon: <VscCode className="w-5 h-5" />,
    },
    {
      name: 'html',
      icon: <VscOpenPreview className="w-5 h-5" />,
    },
    {
      name: 'visualiser',
      icon: <VscGraph className="w-5 h-5" />,
    },
  ];

  return (
    <div className="flex flex-col flex-none bg-gray-800 shadow-lg border-r border-gray-700">
      <div className="flex flex-col border-b border-gray-700">
        {navigation.map(item => (
          <button
            key={item.name}
            onClick={() => setActiveNav(item.name as NavItemType)}
            className={`flex text-sm border-l-2 ${
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
        {tools.map(item => (
          <SidebarItem {...item} key={item.name} />
        ))}
      </div>
    </div>
  );
};