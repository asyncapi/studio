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

  const [{ isDragging }, drag] = useDrag({
    type: 'tab',
    item: { tabID: name },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'tab',
    drop: (item: any, monitor) => {
      // console.log(item, currentPanel)
      PanelsManager.switchTabs(currentPanel, item.tabID, name);
      // console.log(name, item)
      // onDrop(data, item);
      // PanelsManager.addNewTool(currentPanel, item.toolName);
    },
    canDrop: (item, monitor) => {
      // const layout = data.layout;
      // const itemPath = item.path;
      // const splitItemPath = itemPath.split("-");
      // const itemPathRowIndex = splitItemPath[0];
      // const itemRowChildrenLength =
      //   layout[itemPathRowIndex] && layout[itemPathRowIndex].children.length;

      // // prevent removing a col when row has only one col
      // if (
      //   item.type === COLUMN &&
      //   itemRowChildrenLength &&
      //   itemRowChildrenLength < 2
      // ) {
      //   return false;
      // }

      return true;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  drag(ref);
  drop(ref);

  function removeTab(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, tabID: string) {
    event.stopPropagation();
    PanelsManager.removeTab(currentPanel, tabID);
  }

  return (
    <li 
      className='border-r border-gray-700 cursor-pointer'
      ref={ref}
    >
      <div
        className={`group leading-7 px-3 cursor-pointer border-t-2 ${
          activeTab === name
            ? 'text-white border-pink-500'
            : 'text-gray-500 border-gray-800'
        } focus:outline-none border-box`}
        onClick={() => PanelsManager.setActiveTab(currentPanel, name)}
      >
        <div
          className='border-box border-b-2 border-gray-800'
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

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'tool',
    drop: (item: any, monitor) => {
      // console.log(item, currentPanel)
      // onDrop(data, item);
      PanelsManager.addNewTool(currentPanel, item.toolName);
    },
    canDrop: (item, monitor) => {
      // const layout = data.layout;
      // const itemPath = item.path;
      // const splitItemPath = itemPath.split("-");
      // const itemPathRowIndex = splitItemPath[0];
      // const itemRowChildrenLength =
      //   layout[itemPathRowIndex] && layout[itemPathRowIndex].children.length;

      // // prevent removing a col when row has only one col
      // if (
      //   item.type === COLUMN &&
      //   itemRowChildrenLength &&
      //   itemRowChildrenLength < 2
      // ) {
      //   return false;
      // }

      return true;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
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
      onClick={() => PanelsManager.setActivePanel(currentPanel)}
      ref={drop}
    >
      <div
        className="flex flex-none flex-row justify-between items-center text-white font-bold text-xs border-b border-gray-700 bg-gray-800 text-sm w-full"
      >
        <ul className="flex flex-none flex-row">
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
