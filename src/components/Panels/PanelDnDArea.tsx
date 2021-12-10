import React, { useCallback, useContext } from 'react';
import { DropTargetMonitor, useDrop } from "react-dnd";

import { PanelContext } from './PanelContext';

import { PanelsManager, DropDirection, DRAG_DROP_TYPES } from '../../services';

const DRAG_DROP_ACCEPTS = [
  DRAG_DROP_TYPES.PANEL,
  DRAG_DROP_TYPES.TAB,
  DRAG_DROP_TYPES.TOOL,
  DRAG_DROP_TYPES.FILE
];

export const PanelDnDArea: React.FunctionComponent = () => {
  const { currentPanel } = useContext(PanelContext);

  const onDrop = useCallback((item: any, monitor: DropTargetMonitor, direction: DropDirection) => {
    const newPanel = PanelsManager.createPanel(currentPanel, direction);
    if (!newPanel) {
      return;
    }
    switch (monitor.getItemType()) {
      case DRAG_DROP_TYPES.TAB: return PanelsManager.switchTabs(item.tabID, item.panelID, undefined, newPanel.id);
      case DRAG_DROP_TYPES.TOOL: return PanelsManager.addToolTab(item.toolID, newPanel.id);
      default: return;
    }
  }, []);

  // for center area
  const [{ isOverCenterSpace, canDropCenterSpace }, dropCenterSpace] = useDrop({
    accept: DRAG_DROP_ACCEPTS,
    drop: (item: any, monitor) => {
      switch (monitor.getItemType()) {
        case DRAG_DROP_TYPES.TAB: return PanelsManager.switchTabs(item.tabID, item.panelID, undefined, currentPanel);
        case DRAG_DROP_TYPES.TOOL: return PanelsManager.addToolTab(item.toolID, currentPanel);
        default: return;
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
    drop: (item: any, monitor) => onDrop(item, monitor, DropDirection.TOP),
    canDrop: () => true,
    collect: (monitor) => ({
      isOverTopSpace: monitor.isOver(),
      canDropTopSpace: monitor.canDrop(),
    })
  });

  // for bottom area
  const [{ isOverBottomSpace, canDropBottomSpace }, dropBottomSpace] = useDrop({
    accept: DRAG_DROP_ACCEPTS,
    drop: (item: any, monitor) => onDrop(item, monitor, DropDirection.BOTTOM),
    canDrop: () => true,
    collect: (monitor) => ({
      isOverBottomSpace: monitor.isOver(),
      canDropBottomSpace: monitor.canDrop(),
    })
  });

  // for left area
  const [{ isOverLeftSpace, canDropLeftSpace }, dropLeftSpace] = useDrop({
    accept: DRAG_DROP_ACCEPTS,
    drop: (item: any, monitor) => onDrop(item, monitor, DropDirection.LEFT),
    canDrop: () => true,
    collect: (monitor) => ({
      isOverLeftSpace: monitor.isOver(),
      canDropLeftSpace: monitor.canDrop(),
    })
  });

  // for right area
  const [{ isOverRightSpace, canDropRightSpace }, dropRightSpace] = useDrop({
    accept: DRAG_DROP_ACCEPTS,
    drop: (item: any, monitor) => onDrop(item, monitor, DropDirection.RIGHT),
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
