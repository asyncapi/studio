import { useMemo } from 'react';
import { VscNewFile, VscNewFolder, VscSaveAll, VscCollapseAll, VscRefresh } from 'react-icons/vsc';
import { show } from '@ebay/nice-modal-react';

import { TreeViewDirectory } from './TreeViewDirectory';
import { TreeViewDirectoryContextMenu } from './TreeViewDirectoryContextMenu';
import { TreeViewFileContextMenu } from './TreeViewFileContextMenu';
import { CreateNewDirectoryModal, CreateNewFileModal } from '../../Modals/Files';
import { ContextMenu, ExpandedPanel, IconButton } from '../../common';

import type { FunctionComponent } from 'react';

interface FilesProps {}

export const Files: FunctionComponent<FilesProps> = () => {
  const actions = useMemo(() => {
    return [
      <IconButton
        icon={<VscNewFile className='w-4 h-4' />}
        tooltip={{
          content: 'Create new file',
          delay: [500, 0],
        }}
        onClick={e => {
          e.stopPropagation();
          show(CreateNewFileModal);
        }}
      />,
      <IconButton
        icon={<VscNewFolder className='w-4 h-4' />}
        tooltip={{
          content: 'Create new directory',
          delay: [500, 0],
        }}
        onClick={e => {
          e.stopPropagation();
          show(CreateNewDirectoryModal);
        }}
      />,
      <IconButton
        icon={<VscSaveAll className='w-4 h-4' />} 
        tooltip={{
          content: 'Save all files',
          delay: [500, 0],
        }}
      />,
      <IconButton
        icon={<VscCollapseAll className='w-4 h-4' />} 
        tooltip={{
          content: 'Collapse all directories',
          delay: [500, 0],
        }}
      />,
      <IconButton
        icon={<VscRefresh className='w-4 h-4' />}
        tooltip={{
          content: 'Refresh all files',
          delay: [500, 0],
        }} 
      />
    ];
  }, []);

  return (
    <div>
      <ExpandedPanel 
        title='Files' 
        expanded={true}
        actions={actions}
      >
        <div className="flex flex-col bg-gray-800">
          <TreeViewDirectory id='root' expanded={true} />
        </div>

        <TreeViewDirectoryContextMenu />
        <TreeViewFileContextMenu />
      </ExpandedPanel>
    </div>
  );
};
