import React, { useMemo, useEffect, useState, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { VscClose, VscCloseAll, VscEye, VscEyeClosed } from 'react-icons/vsc';

import { ContextPanel } from '../ContextPanel';

import { PanelsManager, DRAG_DROP_TYPES, Panel, PanelTab, PanelID } from '../../../services';

import state from '../../../state';

interface OpenenTabsTabProps extends PanelTab {
  panelID: PanelID;
  isActive: boolean;
  isInsideGroup: boolean;
}

const OpenedTabsTab: React.FunctionComponent<OpenenTabsTabProps> = ({
  id,
  panelID,
  isActive,
  isInsideGroup,
}) => {
  const panelsState = state.usePanelsState();
  const activePanel = panelsState.activePanel.get();
  const ref = useRef(null);

  const [_, drag] = useDrag({
    type: DRAG_DROP_TYPES.TAB,
    item: { tabID: id, panelID },
  });
  const [{ isOver }, drop] = useDrop({
    accept: [
      DRAG_DROP_TYPES.TAB,
      DRAG_DROP_TYPES.FILE,
    ],
    drop: (item: any, monitor) => {
      switch (monitor.getItemType()) {
      case DRAG_DROP_TYPES.TAB: return PanelsManager.switchTabs(item.tabID, item.panelID, id, panelID);
      default: return;
      }
    },
    canDrop: () => true,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    })
  });
  drag(drop(ref));
  
  const activeClassName = isOver || (activePanel === panelID && isActive);
  return (
    <li 
      ref={ref}
      key={id}
      className={`group hover:bg-gray-900 text-xs text-gray-300 leading-6 cursor-pointer ${activeClassName  ? 'bg-gray-900' : 'bg-gray-800'} pr-2 ${isInsideGroup ? 'pl-5' : 'pl-2'}`}
      onClick={(e) => {
        e.stopPropagation();
        PanelsManager.updateActiveTab(id, panelID);
      }}
    >
      <div className="flex flex-row justify-between">
        <div>
          {id}
        </div>
        <div className={`block ${activeClassName ? 'text-gray-900' : 'text-gray-800'} group-hover:text-gray-300`}>
          <button 
            className='inline-block -mt-0.5'
            onClick={ev => {
              ev.stopPropagation();
              PanelsManager.removeTab(id, panelID);
            }}
          >
            <VscClose className="inline-block w-4 h-4" />
          </button>
        </div>
      </div>
    </li>
  );
};

interface OpenedTabsPanelProps extends Panel {
  index?: number;
}

const OpenedTabsPanel: React.FunctionComponent<OpenedTabsPanelProps> = ({
  id: panelID,
  tabs = [],
  visible,
  activeTab,
  index = 0,
}) => {
  const tabsPane = useRef(null);
  const [_, dragTabsPane] = useDrag({
    type: DRAG_DROP_TYPES.PANEL,
    item: { panelID },
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
      case DRAG_DROP_TYPES.PANEL: return PanelsManager.mergePanels(item.panelID, panelID);
      case DRAG_DROP_TYPES.TAB: return PanelsManager.switchTabs(item.tabID, item.panelID, undefined, panelID);
      default: return;
      } 
    },
    canDrop: (item) => item.panelID !== panelID,
    collect: (monitor) => ({
      isOverTabPane: monitor.isOver(),
      canDropTabPane: monitor.canDrop(),
    })
  });
  dragTabsPane(dropTabsPane(tabsPane));

  return (
    <div>
      {index > 0 ? (
        <div 
          ref={tabsPane}
          className={`px-2 group hover:bg-gray-900 ${isOverTabPane && canDropTabPane ? 'bg-gray-900' : 'bg-gray-800'} text-xs text-gray-300 leading-6 uppercase font-bold cursor-pointer`}
          onClick={(e) => {
            e.stopPropagation();
            PanelsManager.updateActivePanel(panelID);
          }}
        >
          <div className="flex flex-row justify-between">
            <h3>Panel {index}</h3>
            <div>
              <button 
                className='inline-block -mt-0.5 text-gray-800 group-hover:text-gray-300'
                onClick={e => {
                  e.stopPropagation();
                  PanelsManager.removePanel(panelID);
                }}
              >
                <VscCloseAll className="inline-block w-4 h-4" />
              </button>
              <button 
                className={`inline-block -mt-0.5 ml-0.5 ${visible === false ? 'text-pink-500' : 'text-gray-800 group-hover:text-gray-300'}`}
                onClick={ev => {
                  ev.stopPropagation();
                  PanelsManager.updatePanelVisibility(visible === false, panelID);
                }}
              >
                {visible === false ? (
                  <VscEyeClosed className="inline-block w-4 h-4" />
                ) : (
                  <VscEye className="inline-block w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <ul>
        {tabs.map(tab => (
          <OpenedTabsTab key={tab.id} {...tab} panelID={panelID} isActive={activeTab === tab.id} isInsideGroup={index > 0} />
        ))}
      </ul>
    </div>
  );
};

interface OpenTabsProps {}

export const OpenedTabs: React.FunctionComponent<OpenTabsProps> = () => {
  const [panels, setPanels] = useState<Panel[]>([]);

  const panelWithTabs = useMemo(() => {
    return panels.filter(panel => panel.tabs && panel.tabs.length);
  }, [panels]);

  useEffect(() => {
    const listener = PanelsManager.addPanelsListener(newPanels => {
      newPanels && setPanels(newPanels);
    });
    return () => {
      PanelsManager.removePanelsListener(listener);
    };
  }, []);

  const menu = (
    <div className="flex flex-row">
      <button 
        className='inline-block'
        onClick={ev => {
          ev.stopPropagation();
          PanelsManager.restoreDefaultPanels();
        }}
      >
        <VscCloseAll className="inline-block w-4 h-4" />
      </button>
    </div>
  );

  return (
    <ContextPanel 
      title="Opened tabs" 
      opened={true}
      menu={menu}
    >
      <div className="flex flex-col">
        {panelWithTabs.length === 1 ? (
          <OpenedTabsPanel {...panelWithTabs[0]} />
        ) : (
          <ul>
            {panelWithTabs.map((panel, index) => (
              <li key={panel.id}>
                <OpenedTabsPanel {...panel} index={index + 1} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </ContextPanel>
  );
};
