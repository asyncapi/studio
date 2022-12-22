import { useCallback } from 'react';
import { VscNewFile, VscNewFolder, VscFolderLibrary, VscEdit, VscTrash, VscJson } from 'react-icons/vsc';
import { show as showModal } from '@ebay/nice-modal-react';

import { CreateNewDirectoryModal, CreateNewFileModal, EditFileModal, DeleteFilePopover } from '../../Modals/Files';
import { ContextMenu, Item, Separator, Submenu } from "../../common";

import { useServices } from '../../../services';

import type { FunctionComponent } from 'react';
import type { ItemParams } from "../../common/ContextMenu";
import type { Directory } from '../../../state/files.state';

interface AdditionalArguments {
  documentType: 'application' | 'library' | 'template';
  language: 'json' | 'yaml';
}

interface TreeViewDirectoryContextMenuProps {}

export const TreeViewDirectoryContextMenu: FunctionComponent<TreeViewDirectoryContextMenuProps> = () => {
  const { filesSvc } = useServices();

  const handleClickDirectory = useCallback(({ props }: ItemParams<{ directory: Directory }>, action: 'open-directory' | 'create-file' | 'create-directory' | 'rename' | 'remove', addArgs?: AdditionalArguments) => {
    const directory = props?.directory;
    if (!directory) {
      return;
    }

    switch (action) {
      case 'open-directory': return filesSvc.openDirectory();
      case 'create-file': return showModal(CreateNewFileModal, { directory });
      case 'create-directory': return showModal(CreateNewDirectoryModal, { directory });
      case 'rename': return showModal(EditFileModal, { item: directory });
      case 'remove': return showModal(DeleteFilePopover, { item: directory });
    }
  }, [filesSvc]);

  const hideOpenDirectory = useCallback(({ props }: ItemParams<{ directory: Directory }>): boolean => {
    const directory = props?.directory;
    if (!directory) {
      return true;
    }
    return !(filesSvc.isSupportedBrowserAPI() && filesSvc.getRootDirectory() === directory);
  }, [filesSvc]);

  return (
    <ContextMenu id='fs-directory'>
      <Item onClick={(args) => handleClickDirectory(args, 'open-directory')} className='group' hidden={hideOpenDirectory as any}>
        <VscFolderLibrary
          className="mr-2 w-4 h-4 text-pink-500 group-hover:text-white"
          aria-hidden="true"
        />
        Open directory
      </Item>

      <Submenu 
        label={(
          <>
            <VscNewFile
              className="mr-2 w-4 h-4 text-pink-500 group-hover:text-white"
              aria-hidden="true"
            />
            Create new file
          </>
        )}
      >
        <Item disabled={true}>
          YAML
        </Item>

        <Item onClick={(args) => handleClickDirectory(args, 'create-file', { documentType: 'application', language: 'yaml' })} className='group'>
          <VscJson
            className="mr-2 w-4 h-4 text-pink-500 group-hover:text-white"
            aria-hidden="true"
          />
          Application document
        </Item>

        <Item onClick={(args) => handleClickDirectory(args, 'create-file', { documentType: 'library', language: 'yaml' })} className='group'>
          <VscJson
            className="mr-2 w-4 h-4 text-pink-500 group-hover:text-white"
            aria-hidden="true"
          />
          Library document
        </Item>

        <Item onClick={(args) => handleClickDirectory(args, 'create-file', { documentType: 'template', language: 'yaml' })} className='group'>
          <VscJson
            className="mr-2 w-4 h-4 text-pink-500 group-hover:text-white"
            aria-hidden="true"
          />
          Use template
        </Item>

        <Separator />

        <Item disabled={true}>
          JSON
        </Item>

        <Item onClick={(args) => handleClickDirectory(args, 'create-file', { documentType: 'application', language: 'json' })} className='group'>
          <VscJson
            className="mr-2 w-4 h-4 text-pink-500 group-hover:text-white"
            aria-hidden="true"
          />
          Application Document
        </Item>

        <Item onClick={(args) => handleClickDirectory(args, 'create-file', { documentType: 'library', language: 'json' })} className='group'>
          <VscJson
            className="mr-2 w-4 h-4 text-pink-500 group-hover:text-white"
            aria-hidden="true"
          />
          Library Document
        </Item>

        <Item onClick={(args) => handleClickDirectory(args, 'create-file', { documentType: 'template', language: 'json' })} className='group'>
          <VscJson
            className="mr-2 w-4 h-4 text-pink-500 group-hover:text-white"
            aria-hidden="true"
          />
          Use template
        </Item>
      </Submenu>

      <Item onClick={(args) => handleClickDirectory(args, 'create-directory')} className='group'>
        <VscNewFolder
          className="mr-2 w-4 h-4 text-pink-500 group-hover:text-white"
          aria-hidden="true"
        />
        Create new directory
      </Item>

      <Separator />

      {/* <Item onClick={(args) => handleClickDirectory(args, 'rename')} className='group'>
        <VscEdit
          className="mr-2 w-4 h-4 text-pink-500 group-hover:text-white"
          aria-hidden="true"
        />
        Rename
      </Item> */}

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
