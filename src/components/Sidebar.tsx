import { VscListSelection, VscCode, VscOpenPreview, VscGraph, VscNewFile } from 'react-icons/vsc';

import { Tooltip } from './common';
import { SettingsModal } from './Modals/Settings/SettingsModal';

import { usePanelsState, panelsState } from '../state/index.state';

import type { FunctionComponent, ReactNode } from 'react';
import type { PanelsState } from '../state/panels.state';

function updateState(panelName: keyof PanelsState['show'], type?: PanelsState['secondaryPanelType']) {
  const settingsState = panelsState.getState();
  let secondaryPanelType = settingsState.secondaryPanelType;
  const newShow = { ...settingsState.show };

  if (type === 'template' || type === 'visualiser') {
    // on current type
    if (secondaryPanelType === type) {
      newShow[`${panelName}`] = !newShow[`${panelName}`];
    } else {
      secondaryPanelType = type;
      if (newShow[`${panelName}`] === false) {
        newShow[`${panelName}`] = true;
      }
    }
  } else {
    newShow[`${panelName}`] = !newShow[`${panelName}`];
  }

  if (!newShow.primaryPanel && !newShow.secondaryPanel) {
    newShow.secondaryPanel = true;
  }

  panelsState.setState({
    show: newShow,
    secondaryPanelType,
  });
}

interface NavItem {
  name: string;
  title: string;
  isActive: boolean;
  updateState?: () => void;
  icon: ReactNode;
  tooltip: ReactNode;
}

interface SidebarProps {}

export const Sidebar: FunctionComponent<SidebarProps> = () => {
  const { show, secondaryPanelType } = usePanelsState();

  if (show.activityBar === false) {
    return null;
  }

  const navigation: NavItem[] = [
    // navigation
    {
      name: 'primarySidebar',
      title: 'Navigation',
      isActive: show.primarySidebar,
      updateState: () => updateState('primarySidebar'),
      icon: <VscListSelection className="w-5 h-5" />,
      tooltip: 'Navigation',
    },
    // editor
    {
      name: 'primaryPanel',
      title: 'Editor',
      isActive: show.primaryPanel,
      updateState: () => updateState('primaryPanel'),
      icon: <VscCode className="w-5 h-5" />,
      tooltip: 'Editor',
    },
    // template
    {
      name: 'template',
      title: 'Template',
      isActive: show.secondaryPanel && secondaryPanelType === 'template',
      updateState: () => updateState('secondaryPanel', 'template'),
      icon: <VscOpenPreview className="w-5 h-5" />,
      tooltip: 'HTML preview',
    },
    // visuliser
    {
      name: 'visualiser',
      title: 'Visualiser',
      isActive: show.secondaryPanel && secondaryPanelType === 'visualiser',
      updateState: () => updateState('secondaryPanel', 'visualiser'),
      icon: <VscGraph className="w-5 h-5" />,
      tooltip: 'Blocks visualiser',
    },
    // newFile
    {
      name: 'newFile',
      title: 'New file',
      isActive: false,
      updateState: () => panelsState.setState({ newFileOpened: true }),
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
              onClick={() => item.updateState?.()}
              className={'flex text-sm focus:outline-none border-box p-2'}
              type="button"
            >
              <div className={item.isActive ? 'bg-gray-600 p-2 rounded text-white' : 'p-2 text-gray-500 hover:text-white'}>
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