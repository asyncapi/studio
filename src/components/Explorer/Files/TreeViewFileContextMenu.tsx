import { useCallback } from 'react';
import { VscEdit, VscTrash } from 'react-icons/vsc';
import { show as showModal } from '@ebay/nice-modal-react';

import { DeleteFilePopover } from '../../Modals/Files';
import { ContextMenu, Item } from "../../common";

import type { FunctionComponent } from 'react';
import type { ItemParams } from "../../common/ContextMenu";
import type { File } from '../../../state/files.state';

export const TreeViewFileContextMenu: FunctionComponent = () => {
  const handleClickFile = useCallback(({ props }: ItemParams<{ file: File }>, action: 'rename' | 'remove') => {
    const file = props?.file;
    if (!file) {
      return;
    }

    switch (action) {
      case 'remove': return showModal(DeleteFilePopover, { item: file });
    }
  }, []);

  return (
    <ContextMenu id='fs-file'>
      <Item onClick={(args) => handleClickFile(args, 'rename')} className='group'>
        <VscEdit
          className="mr-2 w-4 h-4 text-pink-500 group-hover:text-white"
          aria-hidden="true"
        />
        Rename...
      </Item>

      <Item onClick={(args) => handleClickFile(args, 'remove')} className='group'>
        <VscTrash
          className="mr-2 w-4 h-4 text-pink-500 group-hover:text-white"
          aria-hidden="true"
        />
        Remove
      </Item>
    </ContextMenu>
  );
};
