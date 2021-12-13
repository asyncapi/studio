import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { VscSplitHorizontal, VscEllipsis } from 'react-icons/vsc';

import { PanelDnDArea } from './PanelDnDArea';
import { Tab } from './Tabs/Tab';
import { Dropdown } from '../common';

import { PanelContext } from './PanelContext';
import { TabContext } from './Tabs/TabContext';

import { PanelsManager, PanelTab, DRAG_DROP_TYPES, DropDirection } from '../../services';

import state from '../../state';

interface PanelContentProps {}

export const PanelContent: React.FunctionComponent<PanelContentProps> = () => {
  const { currentPanel } = useContext(PanelContext);
  const tabsPane = useRef(null);
  const panelsState = state.usePanelsState();

  const [tabs, setTabs] = useState<PanelTab[]>([]);
  const [activeTab, setActiveTab] = useState('');
  const activePanel = panelsState.activePanel.get();

  useEffect(() => {
    const tabs = PanelsManager.getTabs(currentPanel) || [];
    setTabs(tabs);
    setActiveTab(tabs[0]?.id || '');

    PanelsManager.addPanelTabsListener(currentPanel, (tabs, activeTab) => {
      tabs && setTabs(tabs);
      activeTab && setActiveTab(activeTab);
    });

    return () => {
      PanelsManager.removePanelTabsListener(currentPanel);
    };
  }, []);

  const [, dragTabsPane] = useDrag({
    type: DRAG_DROP_TYPES.PANEL,
    item: { panelID: currentPanel },
  });
  const [{ isOverTabPane, canDropTabPane }, dropTabsPane] = useDrop({
    accept: [
      DRAG_DROP_TYPES.PANEL,
      DRAG_DROP_TYPES.TAB,
      DRAG_DROP_TYPES.TOOL,
      DRAG_DROP_TYPES.FILE
    ],
    drop: (item: any, monitor) => {
      switch (monitor.getItemType()) {
      case DRAG_DROP_TYPES.PANEL: return PanelsManager.mergePanels(item.panelID, currentPanel);
      case DRAG_DROP_TYPES.TAB: return PanelsManager.switchTabs(item.tabID, item.panelID, undefined, currentPanel);
      case DRAG_DROP_TYPES.TOOL: return PanelsManager.addToolTab(item.toolID, currentPanel);
      default: return;
      } 
    },
    canDrop: (item) => item.panelID !== currentPanel,
    collect: (monitor) => ({
      isOverTabPane: monitor.isOver(),
      canDropTabPane: monitor.canDrop(),
    })
  });
  dragTabsPane(dropTabsPane(tabsPane));

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
            title="Hide Panel"
            onClick={(e) => {
              e.stopPropagation();
              PanelsManager.updatePanelVisibility(false, currentPanel);
            }}
          >
            Hide Panel
          </button>
        </li>
        <li className="hover:bg-gray-900">
          <button
            type="button"
            className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150"
            title="Close All"
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
    <div className="relative h-full min-h-full bg-gray-800">
      <div 
        className='flex flex-col h-full min-h-full relative'
        onClick={() => PanelsManager.updateActivePanel(currentPanel)}
      >
        <div className='flex flex-none flex-row justify-between items-center text-white font-bold text-xs border-b border-gray-700 bg-gray-800 text-sm w-full'>
          <ul className={`flex flex-none flex-row ${currentPanel === activePanel ? 'opacity-1' : 'opacity-50'}`}>
            {tabs.map(tab => (
              <Tab key={tab.id} {...tab} activeTab={activeTab} />
            ))}
          </ul>

          <div 
            ref={tabsPane}
            className={`flex-1 w-full h-full ${isOverTabPane && canDropTabPane ? 'bg-gray-700' : 'bg-gray-800'}`}
            style={{ cursor: 'grab' }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              PanelsManager.addTab(PanelsManager.createEmptyTab(), currentPanel);
            }}
          />
          
          <div className="flex flex-row justify-end h-full leading-8">
            <div className="border-l border-gray-700 px-2">
              <button 
                type='button'
                onClick={(e) => {
                  e.stopPropagation();
                  const createdPanel = PanelsManager.createPanel(currentPanel, DropDirection.RIGHT);
                  createdPanel && PanelsManager.addTab(PanelsManager.createEmptyTab(), createdPanel.id);
                }}
              >
                <VscSplitHorizontal className="inline-block" />
              </button>
              {options}
            </div>
          </div>
        </div>
        <div className="flex flex-1 relative">
          <PanelDnDArea />
          <ul>
            {tabs.map(tab => (
              <li
                key={tab.id}
                className={`${activeTab === tab.id ? 'block' : 'hidden'}`}
              >
                <div className="absolute overflow-auto h-auto top-0 bottom-0 right-0 left-0">
                  <TabContext.Provider value={{ currentTab: tab.id, tab }}>
                    {tab.content}
                  </TabContext.Provider>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
