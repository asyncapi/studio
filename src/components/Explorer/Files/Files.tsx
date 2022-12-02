import { useMemo } from 'react';
import { VscNewFile, VscNewFolder, VscSaveAll, VscCollapseAll, VscRefresh } from 'react-icons/vsc';
import { show } from '@ebay/nice-modal-react';

import { TreeViewDirectory } from './TreeViewDirectory';
import { CreateNewDirectoryModal, CreateNewFileModal } from '../../Modals/Files';
import { ExpandedPanel, IconButton } from '../../common';

import type { FunctionComponent } from 'react';

interface FilesProps {}

export const Files: FunctionComponent<FilesProps> = () => {
  const actions = useMemo(() => {
    return [
      <IconButton
        icon={<VscNewFile className='w-3.5 h-3.5' />}
        tooltip='Create New File'
        onClick={e => {
          e.stopPropagation();
          show(CreateNewFileModal);
        }}
      />,
      <IconButton
        icon={<VscNewFolder className='w-3.5 h-3.5' />}
        tooltip='Create New Directory'
        onClick={e => {
          e.stopPropagation();
          show(CreateNewDirectoryModal);
        }}
      />,
      <IconButton
        icon={<VscSaveAll className='w-3.5 h-3.5' />} 
        tooltip='Save All Files'
      />,
      <IconButton
        icon={<VscCollapseAll className='w-3.5 h-3.5' />} 
        tooltip='Collapse All Directories'
      />,
      <IconButton
        icon={<VscRefresh className='w-3.5 h-3.5' />} 
        tooltip='Refresh All Files'
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
          <TreeViewDirectory uri='root' expanded={true} />
        </div>
      </ExpandedPanel>
    </div>
  );
};
