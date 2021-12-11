import React, { useRef, useContext } from 'react';
import { useDrag, useDrop } from "react-dnd";
import { VscClose } from 'react-icons/vsc';

import { PanelContext } from '../PanelContext';

import { PanelsManager, PanelTab, DRAG_DROP_TYPES } from '../../../services';

interface TabProps extends PanelTab {
  activeTab: string,
}

export const Tab: React.FunctionComponent<TabProps> = ({
  id,
  tab,
  activeTab,
}) => {
  const { currentPanel } = useContext(PanelContext);
  const ref = useRef(null);

  const [_, drag] = useDrag({
    type: DRAG_DROP_TYPES.TAB,
    item: { tabID: id, panelID: currentPanel },
  });
  const [{ isOver }, drop] = useDrop({
    accept: [
      DRAG_DROP_TYPES.TAB,
      DRAG_DROP_TYPES.TOOL,
      DRAG_DROP_TYPES.FILE,
    ],
    drop: (item: any, monitor) => {
      switch (monitor.getItemType()) {
        case DRAG_DROP_TYPES.TAB: return PanelsManager.switchTabs(item.tabID, item.panelID, id, currentPanel);
        case DRAG_DROP_TYPES.TOOL: return PanelsManager.addToolTab(item.toolID, currentPanel, id);
        default: return;
      }
    },
    canDrop: () => true,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    })
  });
  drag(drop(ref));

  const activeClassName = activeTab === id
    ? 'text-white border-pink-500'
    : 'text-gray-500 border-gray-800';

  const dropIsOverClassName = isOver
    ? 'bg-gray-700 border-gray-700'
    : 'bg-gray-800 border-gray-800';

  return (
    <li 
      onClick={(e) => {
        e.stopPropagation();

      }}
      className={`border-r border-gray-700 cursor-pointer`}
      ref={ref}
    >
      <div
        className={`group leading-7 px-3 cursor-pointer border-t-2 ${isOver ? dropIsOverClassName : activeClassName} focus:outline-none border-box`}
        onClick={() => PanelsManager.updateActiveTab(id, currentPanel)}
      >
        <div
          className={`border-box border-b-2 ${dropIsOverClassName}`}
        >
          <div className="inline-block">
            {tab}
          </div>
          <button 
            className={`inline ml-1 ${
              activeTab === id
                ? 'text-white'
                : 'text-gray-800 group-hover:text-gray-500'
            }`}
            onClick={ev => {
              ev.stopPropagation();
              PanelsManager.removeTab(id, currentPanel);
            }}
          >
            <VscClose className="inline-block w-4 h-4" />
          </button>
        </div>
      </div>
    </li>
  )
}