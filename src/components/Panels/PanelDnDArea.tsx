import React, { useContext } from 'react';
import { useDrop } from "react-dnd";

import { PanelContext } from './PanelContext';

import { PanelsManager, DRAG_DROP_TYPES } from '../../services';

const DRAG_DROP_ACCEPTS = [
  DRAG_DROP_TYPES.PANE,
  DRAG_DROP_TYPES.TAB,
  DRAG_DROP_TYPES.TOOL,
  DRAG_DROP_TYPES.FILE
];

export const PanelDnDArea: React.FunctionComponent = () => {
  const { currentPanel } = useContext(PanelContext);

  // for center area
  const [{ isOverCenterSpace, canDropCenterSpace }, dropCenterSpace] = useDrop({
    accept: DRAG_DROP_ACCEPTS,
    drop: (item: any, monitor) => {
      if (item.toolName) {
        PanelsManager.addNewTool(currentPanel, item.toolName);
      } else {
        PanelsManager.switchTabs(item.panelID, currentPanel, item.tabID, 0);
      }
    },
    canDrop: () => true,
    collect: (monitor) => {
      return {
        isOverCenterSpace: monitor.isOver(),
        canDropCenterSpace: monitor.canDrop(),
      }
    }
  });

  // for top area
  const [{ isOverTopSpace, canDropTopSpace }, dropTopSpace] = useDrop({
    accept: DRAG_DROP_ACCEPTS,
    drop: (item: any, monitor) => {
      PanelsManager.addPanelNew(currentPanel, 'top', monitor.getItemType() as any, item);
    },
    canDrop: () => true,
    collect: (monitor) => ({
      isOverTopSpace: monitor.isOver(),
      canDropTopSpace: monitor.canDrop(),
    })
  });

  // for bottom area
  const [{ isOverBottomSpace, canDropBottomSpace }, dropBottomSpace] = useDrop({
    accept: DRAG_DROP_ACCEPTS,
    drop: (item: any, monitor) => {
      PanelsManager.addPanelNew(currentPanel, 'bottom', monitor.getItemType() as any, item);
    },
    canDrop: () => true,
    collect: (monitor) => ({
      isOverBottomSpace: monitor.isOver(),
      canDropBottomSpace: monitor.canDrop(),
    })
  });

  // for left area
  const [{ isOverLeftSpace, canDropLeftSpace }, dropLeftSpace] = useDrop({
    accept: DRAG_DROP_ACCEPTS,
    drop: (item: any, monitor) => {
      PanelsManager.addPanelNew(currentPanel, 'left', monitor.getItemType() as any, item);
    },
    canDrop: () => true,
    collect: (monitor) => ({
      isOverLeftSpace: monitor.isOver(),
      canDropLeftSpace: monitor.canDrop(),
    })
  });

  // for right area
  const [{ isOverRightSpace, canDropRightSpace }, dropRightSpace] = useDrop({
    accept: DRAG_DROP_ACCEPTS,
    drop: (item: any, monitor) => {
      PanelsManager.addPanelNew(currentPanel, 'right', monitor.getItemType() as any, item);
    },
    canDrop: () => true,
    collect: (monitor) => ({
      isOverRightSpace: monitor.isOver(),
      canDropRightSpace: monitor.canDrop(),
    })
  });

  const canDrop = canDropCenterSpace || canDropTopSpace || canDropBottomSpace || canDropLeftSpace || canDropRightSpace;
  return (
    <div className={canDrop ? 'block' : 'hidden'}>
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
    </div>
  );
};
