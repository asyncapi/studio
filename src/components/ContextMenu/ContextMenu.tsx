import React from 'react';

import { ExplorerContextMenu } from './Explorer/Explorer';
import { TemplatesContextMenu } from './Templates/Templates';
import { ToolsContextMenu } from './Tools/Tools';

import state from '../../state';

interface ContextMenuProps {}

export const ContextMenu: React.FunctionComponent<ContextMenuProps> = () => {
  const sidebarState = state.useSidebarState();
  const activePanel = sidebarState.activePanel.get();

  return (
    <div className="h-full overflow-auto bg-gray-800">
      <div className={activePanel === 'explorer' ? 'block' : 'hidden'}>
        <ExplorerContextMenu />
      </div>
      <div className={activePanel === 'tools' ? 'block' : 'hidden'}>
        <ToolsContextMenu />
      </div>
      <div className={activePanel === 'templates' ? 'block' : 'hidden'}>
        <TemplatesContextMenu />
      </div>
    </div>
  );
};
