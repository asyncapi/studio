import { useCallback } from 'react';
import { VscNewFile, VscNewFolder, VscEdit, VscTrash } from 'react-icons/vsc';
import { show as showModal } from '@ebay/nice-modal-react';

import { CreateNewDirectoryModal, CreateNewFileModal, EditFileModal, DeleteFileModal } from '../../Modals/Files';
import { ContextMenu, Item } from "../../common";

import type { FunctionComponent } from 'react';
import type { ItemParams } from "../../common/ContextMenu";

export const TreeViewDirectoryContextMenu: FunctionComponent = () => {
  const handleClickDirectory = useCallback(({ props }: ItemParams, action: 'create-file' | 'create-directory' | 'rename' | 'remove') => {
    const directory = props.directory;
    if (!directory) {
      return;
    }

    switch (action) {
      case 'create-file': return showModal(CreateNewFileModal, { directory });
      case 'create-directory': return showModal(CreateNewDirectoryModal, { directory });
      case 'rename': return showModal(EditFileModal, { item: directory });
      case 'remove': return showModal(DeleteFileModal, { item: directory });
    }
  }, []);

  return (
    <ContextMenu id='fs-directory'>
      <Item onClick={(args) => handleClickDirectory(args, 'create-file')} className='group'>
        <VscNewFile
          className="mr-2 w-4 h-4 text-pink-500 group-hover:text-white"
          aria-hidden="true"
        />
        Create new file
      </Item>

      <Item onClick={(args) => handleClickDirectory(args, 'create-directory')} className='group'>
        <VscNewFolder
          className="mr-2 w-4 h-4 text-pink-500 group-hover:text-white"
          aria-hidden="true"
        />
        Create new directory
      </Item>

      <Item onClick={(args) => handleClickDirectory(args, 'rename')} className='group'>
        <VscEdit
          className="mr-2 w-4 h-4 text-pink-500 group-hover:text-white"
          aria-hidden="true"
        />
        Rename...
      </Item>

      <Item onClick={(args) => handleClickDirectory(args, 'remove')} className='group'>
        <VscTrash
          className="mr-2 w-4 h-4 text-pink-500 group-hover:text-white"
          aria-hidden="true"
        />
        Remove
      </Item>
    </ContextMenu>
  );
};
