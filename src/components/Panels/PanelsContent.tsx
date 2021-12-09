import React, { useContext, useEffect, useState } from 'react';
import { useDrag, useDrop } from "react-dnd";
import { VscAdd, VscSplitHorizontal, VscEllipsis } from 'react-icons/vsc';

import { PanelDnDArea } from './PanelDnDArea';
import { NewTab } from './Tabs/NewTab';
import { Tab } from './Tabs/Tab';
import { Dropdown } from '../common';

import { PanelContext } from './PanelContext';
import { TabContext } from './Tabs/TabContext';

import { PanelsManager, DRAG_DROP_TYPES } from '../../services';
import { generateUniqueID } from '../../helpers';

import state from '../../state';

export interface PanelTab {
  name: string;
  tab: React.ReactNode;
  content: React.ReactNode;
  isNewTab: boolean;
}

interface PanelContentProps {
  tabs: Array<PanelTab>;
  active?: string;
}

export const PanelContent: React.FunctionComponent<PanelContentProps> = ({
  tabs: propTabs = [],
  active,
}) => {
  const { currentPanel } = useContext(PanelContext);
  const panelsState = state.usePanelsState();

  const [tabs, setTabs] = useState(propTabs);
  const [activeTab, setActiveTab] = useState(active || propTabs[0].name);
  const activePanel = panelsState.activePanel.get();

  const [{ isOverTabPane, canDropTabPane }, dropTabsPane] = useDrop({
    accept: [
      DRAG_DROP_TYPES.PANE,
      DRAG_DROP_TYPES.TAB,
      DRAG_DROP_TYPES.TOOL,
      DRAG_DROP_TYPES.FILE
    ],
    drop: (item: any) => {
      if (item.toolName) {
        PanelsManager.addNewTool(currentPanel, item.toolName);
      } else {
        PanelsManager.switchTabs(item.panelID, currentPanel, item.tabID, 0);
      }
    },
    canDrop: (item) => {
      return item.panelID !== currentPanel;
    },
    collect: (monitor) => ({
      isOverTabPane: monitor.isOver(),
      canDropTabPane: monitor.canDrop(),
    })
  });

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
    PanelsManager.addTab(currentPanel, {
      name: generateUniqueID(),
      tab: <span>New</span>,
      content: (
        <NewTab />
      ),
      isNewTab: true,
    });
  }

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
            onClick={(e) => {
              e.stopPropagation();
              PanelsManager.removePanel(currentPanel);
            }}
          >
            Close All
          </button>
        </li>
      </ul>
    </Dropdown>
  );

  return (
    <div 
      className='flex flex-col h-full min-h-full relative'
      onClick={() => PanelsManager.setActivePanel(currentPanel)}
    >
      <div
        className={`flex flex-none flex-row justify-between items-center text-white font-bold text-xs border-b border-gray-700 bg-gray-800 text-sm w-full`}
      >
        <ul
          className={`flex flex-none flex-row ${currentPanel === activePanel ? 'opacity-1' : 'opacity-50'}`}
        >
          {tabs.map(tab => (
            <Tab key={tab.name} {...tab} activeTab={activeTab} />
          ))}
        </ul>
        <button 
          className="flex-none border-r border-gray-700 h-full leading-7 px-2"
          onClick={(e) => addTab(e)}
        >
          <VscAdd className="inline-block" />
        </button>
        <div className={`flex-1 w-full h-full ${isOverTabPane && canDropTabPane ? 'bg-gray-700' : 'bg-gray-800'}`} ref={dropTabsPane} />
        <div className="flex flex-row justify-end h-full leading-8">
          <div className="border-l border-gray-700 px-2">
            <button 
              type='button'
              onClick={() => PanelsManager.addPanel(currentPanel, 'right')}
            >
              <VscSplitHorizontal className="inline-block" />
            </button>
            {options}
          </div>
        </div>
      </div>
      <div 
        className="flex flex-1 relative"
      >
        <PanelDnDArea />
        <ul>
          {tabs.map(tab => (
            <li
              key={tab.name}
              className={`${activeTab === tab.name ? 'block' : 'hidden'}`}
            >
              <div className="absolute overflow-auto h-auto top-0 bottom-0 right-0 left-0">
                <TabContext.Provider value={{ currentTab: tab.name }}>
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
