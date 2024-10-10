import { VscListSelection, VscCode, VscOpenPreview, VscGraph, VscNewFile, VscSettingsGear, VscPlayCircle } from 'react-icons/vsc';
import { show as showModal } from '@ebay/nice-modal-react';

import { Tooltip } from './common';
import { SettingsModal, ConfirmNewFileModal } from './Modals';

import { usePanelsState, panelsState, useDocumentsState } from '@/state';

import { useEffect, useState, type FunctionComponent, type ReactNode } from 'react';
import type { PanelsState } from '@/state/panels.state';
import { driverObj } from '@/helpers/driver';

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
  onClick: () => void;
  icon: ReactNode;
  tooltip: ReactNode;
  enabled: boolean;
  dataTest: string;
}

interface SidebarProps {}

export const Sidebar: FunctionComponent<SidebarProps> = () => {
  const { show, secondaryPanelType } = usePanelsState();
  const [document, hasErrors] = useDocumentsState((state) => [
    state.documents['asyncapi']?.document,
    state.documents['asyncapi']?.diagnostics?.errors.length > 0,
  ]) || [null, false];

  const [isV3, setIsV3] = useState(document?.version().startsWith('3.'));

  let navigation: NavItem[] = [
    // navigation
    {
      name: 'primarySidebar',
      title: 'Navigation',
      isActive: show.primarySidebar,
      onClick: () => updateState('primarySidebar'),
      icon: <VscListSelection className="w-5 h-5" />,
      tooltip: 'Navigation',
      enabled: true,
      dataTest: 'button-navigation',
    },
    // editor
    {
      name: 'primaryPanel',
      title: 'Editor',
      isActive: show.primaryPanel,
      onClick: () => updateState('primaryPanel'),
      icon: <VscCode className="w-5 h-5" />,
      tooltip: 'Editor',
      enabled: true,
      dataTest: 'button-editor',
    },
    // template
    {
      name: 'template',
      title: 'Template preview',
      isActive: show.secondaryPanel && secondaryPanelType === 'template',
      onClick: () => updateState('secondaryPanel', 'template'),
      icon: <VscOpenPreview className="w-5 h-5" />,
      tooltip: 'Template preview',
      enabled: true,
      dataTest: 'button-template-preview',
    },
    // visuliser
    {
      name: 'visualiser',
      title: 'Blocks visualiser',
      isActive: show.secondaryPanel && secondaryPanelType === 'visualiser',
      onClick: () => updateState('secondaryPanel', 'visualiser'),
      icon: <VscGraph className="w-5 h-5" />,
      tooltip: 'Blocks visualiser',
      enabled: !isV3,
      dataTest: 'button-blocks-visualiser',
    },
    // newFile
    {
      name: 'newFile',
      title: 'New file',
      isActive: false,
      onClick: () => showModal(ConfirmNewFileModal),
      icon: <VscNewFile className="w-5 h-5" />,
      tooltip: 'New file',
      enabled: true,
      dataTest: 'button-new-file',
    },
  ];

  navigation = navigation.filter(item => item.enabled);

  const driverTourHandler = () => {
    const getCurrentTourStep = localStorage.getItem('currentTourStep');
    driverObj.drive(parseInt(getCurrentTourStep ?? '0', 10));
  };

  useEffect(() => {
    // if the document has no errors then only update the setIsV3 variable
    if (!hasErrors) {
      setIsV3(document?.version().startsWith('3.'));
    }
  }, [document]);

  if (show.activityBar === false) {
    return null;
  }
  
  return (
    <div className="flex flex-col bg-gray-800 shadow-lg border-r border-gray-700 justify-between" id="sidebar">
      <div className="flex flex-col">
        {navigation.map(item => (
          <Tooltip content={item.tooltip} placement='right' hideOnClick={true} key={item.name}>
            <button
              onClick={() => item.onClick()}
              className={'flex text-sm focus:outline-none border-box p-2'}
              type="button"
              data-test={item.dataTest}
            >
              <div className={item.isActive ? 'bg-gray-600 p-2 rounded text-white' : 'p-2 text-gray-500 hover:text-white'}>
                {item.icon}
              </div>
            </button>
          </Tooltip>
        ))}
      </div>
      <div className="flex flex-col">
        <Tooltip content='Start Tour' placement='right' hideOnClick={true}>
          <button
            title="Start Tour"  
            className='flex text-gray-500 hover:text-white focus:outline-none border-box p-4'
            type="button"  
            onClick={driverTourHandler}
          >
            <VscPlayCircle className="w-6 h-6" />
          </button>
        </Tooltip>
        <Tooltip content='Studio settings' placement='right' hideOnClick={true}>
          <button
            className='flex text-gray-500 hover:text-white focus:outline-none border-box p-4'
            type="button"  
            onClick={() => showModal(SettingsModal)}
            id="studio-setting"
            data-test="button-settings"
          >
            <VscSettingsGear className="w-5 h-5"  />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};
