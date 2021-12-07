import React, { useContext, useEffect, useState } from 'react';

import { VscClose, VscAdd, VscSplitHorizontal, VscSplitVertical, VscEllipsis, VscCircleLargeFilled, VscCircleLargeOutline } from 'react-icons/vsc';
import { generateUniqueID } from '../../helpers';
import { PanelsManager } from '../../services';
import { Dropdown } from '../common';
import { NewTab } from './NewTab';
import { PanelContext } from './PanelContext';
import { TabContext } from './TabContext';

import state from '../../state';

export interface PanelTab {
  name: string;
  tab: React.ReactNode;
  content: React.ReactNode;
  isNewTab: boolean;
}

interface PanelTabsProps {
  tabs: Array<PanelTab>;
  active?: string;
}

export const PanelTabs: React.FunctionComponent<PanelTabsProps> = ({
  tabs: propTabs = [],
  active,
}) => {
  const { currentPanel } = useContext(PanelContext);
  const panelsState = state.usePanelsState();

  const [tabs, setTabs] = useState(propTabs);
  const [activeTab, setActiveTab] = useState(active || propTabs[0].name);
  const activePanel = panelsState.activePanel.get();

  useEffect(() => {
    PanelsManager.setTabs(
      currentPanel,
      tabs,
      setActiveTab,
      setTabs,
    );

    return () => {
      PanelsManager.unsetTabs(currentPanel);
    };
  }, []);

  function addTab(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.stopPropagation();
    setActivePanel();
    PanelsManager.addTab(currentPanel, {
      name: generateUniqueID(),
      tab: <span>New</span>,
      content: (
        <NewTab />
      ),
      isNewTab: true,
    });
  }

  function removeTab(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, tabID: string) {
    event.stopPropagation();
    setActivePanel();
    PanelsManager.removeTab(currentPanel, tabID);
  }

  function changeTab(tabName: string, newTab: PanelTab) {
    setActivePanel();
    PanelsManager.changeTab(currentPanel, tabName, newTab);
  }

  function setActivePanel() {
    currentPanel !== panelsState.activePanel.get() && panelsState.activePanel.set(currentPanel);
  }

  const splitHorizontal = (
    <Dropdown
      button={(setOpen) => (
        <button 
          onClick={() => setOpen(open => !open)}
          className="ml-2"
        >
          <VscSplitHorizontal className="inline-block" />
        </button>
      )}
      opener={<VscSplitHorizontal className="inline-block" />}
      buttonHoverClassName="text-white"
      className="relative inline-block"
    >
      <ul className="bg-gray-800 text-md text-white">
        <li className="hover:bg-gray-900">
          <button
            type="button"
            className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150"
            title="Nearest scope"
            onClick={() => PanelsManager.addPanel(currentPanel, 'horizontal', 'nearest')}
          >
            Nearest scope
          </button>
        </li>
        <li className="hover:bg-gray-900">
          <button
            type="button"
            className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150"
            title="Upper scope"
            onClick={() => PanelsManager.addPanel(currentPanel, 'horizontal', 'upper')}
          >
            Upper scope
          </button>
        </li>
      </ul>
    </Dropdown>
  );

  const splitVertical = (
    <Dropdown
      button={(setOpen) => (
        <button 
          onClick={() => setOpen(open => !open)}
          className="ml-2"
        >
          <VscSplitVertical className="inline-block" />
        </button>
      )}
      buttonHoverClassName="text-white"
      className="relative inline-block"
    >
      <ul className="bg-gray-800 text-md text-white">
        <li className="hover:bg-gray-900">
          <button
            type="button"
            className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150"
            title="Nearest scope"
            onClick={() => PanelsManager.addPanel(currentPanel, 'vertical', 'nearest')}
          >
            Nearest scope
          </button>
        </li>
        <li className="hover:bg-gray-900">
          <button
            type="button"
            className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150"
            title="Upper scope"
            onClick={() => PanelsManager.addPanel(currentPanel, 'vertical', 'upper')}
          >
            Upper scope
          </button>
        </li>
      </ul>
    </Dropdown>
  );

  const options = (
    <Dropdown
      button={(setOpen) => (
        <button 
          onClick={() => setOpen(open => !open)}
          className="ml-2"
        >
          <VscEllipsis className="inline-block" />
        </button>
      )}
      buttonHoverClassName="text-white"
      className="relative inline-block"
    >
      <ul className="bg-gray-800 text-md text-white">
        <li className="hover:bg-gray-900">
          <button
            type="button"
            className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150"
            title="Delete panel"
            onClick={() => PanelsManager.removePanel(currentPanel)}
          >
            Delete panel
          </button>
        </li>
      </ul>
    </Dropdown>
  );

  return (
    <div 
      className="flex flex-col h-full min-h-full"
      onClick={setActivePanel}
    >
      <div
        className="flex flex-none flex-row justify-between items-center text-white font-bold text-xs border-b border-gray-700 bg-gray-800 text-sm w-full"
      >
        <ul className="flex flex-none flex-row">
          {tabs.map(tab => (
            <li 
              key={tab.name}
              className='border-r border-gray-700 cursor-pointer'
            >
              <div
                className={`group leading-7 px-3 cursor-pointer border-t-2 ${
                  activeTab === tab.name
                    ? 'text-white border-pink-500'
                    : 'text-gray-500 border-gray-800'
                } focus:outline-none border-box`}
                onClick={() => PanelsManager.setActiveTab(currentPanel, tab.name)}
              >
                <div
                  className='border-box border-b-2 border-gray-800'
                >
                  <div className="inline-block">
                    {tab.tab}
                  </div>
                  <button 
                    className={`inline ml-1 ${
                      activeTab === tab.name
                        ? 'text-white'
                        : 'text-gray-800 group-hover:text-gray-500'
                    }`}
                    onClick={(e) => removeTab(e, tab.name)}
                  >
                    <VscClose className="inline-block w-4 h-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button 
          className="flex-none border-r border-gray-700 h-full leading-7 px-2"
          onClick={(e) => addTab(e)}
        >
          <VscAdd className="inline-block" />
        </button>
        <div className="flex flex-1 flex-row justify-end h-full leading-8">
          <div className="border-l border-gray-700 px-2">
            {currentPanel === activePanel ? <VscCircleLargeFilled className="inline-block text-pink-500" /> : <VscCircleLargeOutline className="inline-block" />}
            {splitHorizontal}
            {splitVertical}
            {options}
          </div>
        </div>
      </div>
      <div className="flex flex-1 relative">
        <ul>
          {tabs.map(tab => (
            <li
              key={tab.name}
              className={`${activeTab === tab.name ? 'block' : 'hidden'}`}
            >
              <div className="absolute overflow-auto h-auto top-0 bottom-0 right-0 left-0">
                <TabContext.Provider value={{ changeTab, currentTab: tab.name }}>
                  {tab.content}
                </TabContext.Provider>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
