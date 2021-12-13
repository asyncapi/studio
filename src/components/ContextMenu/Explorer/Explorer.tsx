import React from 'react';

import { OpenedTabs } from './OpenedTabs';
import { FileSystem } from './FileSystem';
import { Navigation } from '../../Navigation';

import { ContextPanel } from '../ContextPanel';

interface ExplorerContextMenuProps {}

export const ExplorerContextMenu: React.FunctionComponent<ExplorerContextMenuProps> = () => {
  return (
    <div className="flex flex-col">
      <h2 className="p-2 text-gray-500 text-xs uppercase">
        Explorer
      </h2>
      
      <OpenedTabs />
      <FileSystem />
      <ContextPanel title="Document structure" opened={true}>
        <Navigation />
      </ContextPanel>
    </div>
  );
};
