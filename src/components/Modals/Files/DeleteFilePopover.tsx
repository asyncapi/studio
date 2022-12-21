import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { create } from '@ebay/nice-modal-react';

import { Popover } from '../index';

import { useServices } from '../../../services';

import type { Directory, File } from '../../../state/files.state';

interface DeleteFilePopoverProps {
  item: Directory | File;
}

export const DeleteFilePopover = create<DeleteFilePopoverProps>(({ item }) => {
  const { filesSvc } = useServices();
  const { type } = item;

  const absolutePath = filesSvc.absolutePath(item);
  const name = item.type === 'file' ? `${absolutePath}.${item.language}` : absolutePath;

  const title = `Remove the "${name}" ${type}?`;
  const description = type === 'directory' 
    ? `Are you sure you want to delete "${name}" directory and its contents? This operation will be permament.`
    : `Are you sure you want to delete "${name}" file? This operation will be permament.`

  const onConfirm = useCallback(async () => {
    if (item.type === 'directory') {
      return filesSvc.removeDirectory(item.id);
    }
    return filesSvc.removeFile(item.id)
  }, [item, filesSvc]);

  return (
    <Popover
      title={title}
      confirmText="Remove"
      onConfirm={onConfirm}
    >
      <div className="flex content-center text-center justify-center">
        <p>{description}</p>
      </div>
    </Popover>
  );
});
