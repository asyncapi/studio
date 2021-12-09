import React, { useRef, useContext, useEffect, useState } from 'react';
import { useDrag, useDrop } from "react-dnd";
import { VscClose, VscAdd, VscSplitHorizontal, VscSplitVertical, VscEllipsis, VscCircleLargeFilled, VscCircleLargeOutline } from 'react-icons/vsc';

import { generateUniqueID } from '../../helpers';
import { PanelsManager } from '../../services';
import { Dropdown } from '../common';
import { NewTab } from './NewTab';
import { PanelContext } from './PanelContext';
import { TabContext } from './TabContext';

import state from '../../state';
import { connect } from 'http2';

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

const Tab: React.FunctionComponent<PanelTab & { activeTab: string }> = ({
  name,
  tab,
  activeTab,
}) => {
  const ref = useRef(null);
  const { currentPanel } = useContext(PanelContext);

  const [_, drag] = useDrag({
    type: 'tab',
    item: { tabID: name, panelID: currentPanel },
  });
  const [{ isOver }, drop] = useDrop({
    accept: ['tab', 'tool'],
    drop: (item: any, monitor) => {
      if (item.toolName) {
        PanelsManager.addNewTool(currentPanel, item.toolName);
      } else {
        PanelsManager.switchTabs(item.panelID, currentPanel, item.tabID, name);
      }
    },
    canDrop: () => {
      return true;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    })
  });

  drag(drop(ref))

  function removeTab(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, tabID: string) {
    event.stopPropagation();
    PanelsManager.removeTab(currentPanel, tabID);
  }

  const activeClassName = activeTab === name
    ? 'text-white border-pink-500'
    : 'text-gray-500 border-gray-800';

  const dropIsOverClassName = isOver
    ? 'bg-gray-700 border-gray-700'
    : 'bg-gray-800 border-gray-800';

  return (
    <li 
      className={`border-r border-gray-700 cursor-pointer`}
      ref={ref}
    >
      <div
        className={`group leading-7 px-3 cursor-pointer border-t-2 ${isOver ? dropIsOverClassName : activeClassName} focus:outline-none border-box`}
        onClick={() => PanelsManager.setActiveTab(currentPanel, name)}
      >
        <div
          className={`border-box border-b-2 ${dropIsOverClassName}`}
        >
          <div className="inline-block">
            {tab}
          </div>
          <button 
            className={`inline ml-1 ${
              activeTab === name
                ? 'text-white'
                : 'text-gray-800 group-hover:text-gray-500'
            }`}
            onClick={(e) => removeTab(e, name)}
          >
            <VscClose className="inline-block w-4 h-4" />
          </button>
        </div>
      </div>
    </li>
  )
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

  const [{ isOverTabPane, canDropTabPane }, dropTabsPane] = useDrop({
    accept: ['tab', 'tool'],
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

  // for center space
  const [{ isOverCenterSpace, canDropCenterSpace }, dropCenterSpace] = useDrop({
    accept: ['tool', 'tab'],
    drop: (item: any, monitor) => {
      if (item.toolName) {
        PanelsManager.addNewTool(currentPanel, item.toolName);
      } else {
        PanelsManager.switchTabs(item.panelID, currentPanel, item.tabID, 0);
      }
    },
    canDrop: () => {
      return true;
    },
    collect: (monitor) => {
      return {
        isOverCenterSpace: monitor.isOver(),
        canDropCenterSpace: monitor.canDrop(),
      }
    }
  });

  // for top space
  const [{ isOverTopSpace, canDropTopSpace }, dropTopSpace] = useDrop({
    accept: ['tool', 'tab'],
    drop: (item: any, monitor) => {
      PanelsManager.addPanelNew(currentPanel, 'top', monitor.getItemType() as any, item);
    },
    canDrop: () => {
      return true;
    },
    collect: (monitor) => ({
      isOverTopSpace: monitor.isOver(),
      canDropTopSpace: monitor.canDrop(),
    })
  });

  // for left space
  const [{ isOverLeftSpace, canDropLeftSpace }, dropLeftSpace] = useDrop({
    accept: ['tool', 'tab'],
    drop: (item: any, monitor) => {
      PanelsManager.addPanelNew(currentPanel, 'left', monitor.getItemType() as any, item);
    },
    canDrop: () => {
      return true;
    },
    collect: (monitor) => ({
      isOverLeftSpace: monitor.isOver(),
      canDropLeftSpace: monitor.canDrop(),
    })
  });

  // for right space
  const [{ isOverRightSpace, canDropRightSpace }, dropRightSpace] = useDrop({
    accept: ['tool', 'tab'],
    drop: (item: any, monitor) => {
      PanelsManager.addPanelNew(currentPanel, 'right', monitor.getItemType() as any, item);
    },
    canDrop: () => {
      return true;
    },
    collect: (monitor) => ({
      isOverRightSpace: monitor.isOver(),
      canDropRightSpace: monitor.canDrop(),
    })
  });

  // for bottom space
  const [{ isOverBottomSpace, canDropBottomSpace }, dropBottomSpace] = useDrop({
    accept: ['tool', 'tab'],
    drop: (item: any, monitor) => {
      PanelsManager.addPanelNew(currentPanel, 'bottom', monitor.getItemType() as any, item);
    },
    canDrop: () => {
      return true;
    },
    collect: (monitor) => ({
      isOverBottomSpace: monitor.isOver(),
      canDropBottomSpace: monitor.canDrop(),
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

  function changeTab(tabName: string, newTab: PanelTab) {
    PanelsManager.changeTab(currentPanel, tabName, newTab);
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
        className="flex flex-none flex-row justify-between items-center text-white font-bold text-xs border-b border-gray-700 bg-gray-800 text-sm w-full"
      >
        <ul
          className="flex flex-none flex-row"
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
            {currentPanel === activePanel ? <VscCircleLargeFilled className="inline-block text-pink-500" /> : <VscCircleLargeOutline className="inline-block" />}
            <button 
              type='button'
              className="ml-2"
              onClick={() => PanelsManager.addPanel(currentPanel, 'right')}
            >
              <VscSplitHorizontal className="inline-block" />
            </button>
            {/* <button 
              type='button'
              className="ml-2"
              onClick={() => PanelsManager.addPanel(currentPanel, 'vertical')}
            >
              <VscSplitVertical className="inline-block" />
            </button> */}
            {options}
          </div>
        </div>
      </div>
      <div 
        className="flex flex-1 relative"
      >
        {/* center space */}
        <div className={`absolute w-full h-full top-0 left-0 right-0 bottom-0 p-16 z-50 bg-gray-700 ${canDropCenterSpace && isOverCenterSpace ? 'visible opacity-75' : 'invisible opacity-0'}`}>
          <div className={`h-full w-full ${canDropCenterSpace ? 'visible' : 'invisible'}`} ref={dropCenterSpace} />
        </div>
      
        {/* top space */}
        <div className={`absolute w-full top-0 left-0 right-0 z-50 bg-gray-700 opacity-75`} style={{ height: canDropTopSpace && isOverTopSpace ? '50%' : '0' }}>
          <div className={`h-16 w-full ${canDropTopSpace ? 'visible' : 'invisible'}`} ref={dropTopSpace} />
        </div>

        {/* bottom space */}
        <div className={`absolute w-full bottom-0 left-0 right-0 z-50 bg-gray-700 opacity-75`} style={{ height: canDropBottomSpace && isOverBottomSpace ? '50%' : '0' }}>
          <div className={`h-16 w-full absolute bottom-0 ${canDropBottomSpace ? 'visible' : 'invisible'}`} ref={dropBottomSpace} />
        </div>

        {/* left space */}
        <div className={`absolute h-full py-16 top-0 bottom-0 left-0 z-50 bg-gray-700 opacity-75`} style={{ width: canDropLeftSpace && isOverLeftSpace ? '50%' : '0' }}>
          <div className={`h-full w-16 ${canDropLeftSpace ? 'visible' : 'invisible'}`} ref={dropLeftSpace} />
        </div>

        {/* right space */}
        <div className={`absolute h-full py-16 top-0 bottom-0 right-0 z-50 bg-gray-700 opacity-75`} style={{ width: canDropRightSpace && isOverRightSpace ? '50%' : '0' }}>
          <div className={`h-full w-16 absolute right-0 ${canDropRightSpace ? 'visible' : 'invisible'}`} ref={dropRightSpace} />
        </div>

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
