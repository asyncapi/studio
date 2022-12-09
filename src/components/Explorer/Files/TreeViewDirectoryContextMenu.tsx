import { useCallback } from 'react';
import { VscNewFile, VscNewFolder, VscFolderLibrary, VscEdit, VscTrash } from 'react-icons/vsc';
import { show as showModal } from '@ebay/nice-modal-react';

import { CreateNewDirectoryModal, CreateNewFileModal, EditFileModal, DeleteFileModal } from '../../Modals/Files';
import { ContextMenu, Item } from "../../common";

import { useServices } from '../../../services';

import type { FunctionComponent } from 'react';
import type { ItemParams } from "../../common/ContextMenu";
import type { Directory } from '../../../state/files.state';

interface TreeViewDirectoryContextMenuProps {
  id?: string;
  onRoot?: boolean
}

export const TreeViewDirectoryContextMenu: FunctionComponent<TreeViewDirectoryContextMenuProps> = ({
  id = 'fs-directory',
  onRoot = false,
}) => {
  const { filesSvc } = useServices();
  const isSupportedBrowserAPI = filesSvc.isSupportedBrowserAPI();

  const handleClickDirectory = useCallback(({ props }: ItemParams<{ directory: Directory }>, action: 'open-directory' | 'create-file' | 'create-directory' | 'rename' | 'remove') => {
    const directory = props?.directory;
    if (!directory) {
      return;
    }

    switch (action) {
      case 'open-directory': return filesSvc.openDirectory();
      case 'create-file': return showModal(CreateNewFileModal, { directory });
      case 'create-directory': return showModal(CreateNewDirectoryModal, { directory });
      case 'rename': return showModal(EditFileModal, { item: directory });
      case 'remove': return showModal(DeleteFileModal, { item: directory });
    }
  }, [filesSvc]);

  return (
    <ContextMenu id={id}>
      {isSupportedBrowserAPI && onRoot && (
        <Item onClick={(args) => handleClickDirectory(args, 'open-directory')} className='group'>
          <VscFolderLibrary
            className="mr-2 w-4 h-4 text-pink-500 group-hover:text-white"
            aria-hidden="true"
          />
          Open directory
        </Item>
      )}

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
