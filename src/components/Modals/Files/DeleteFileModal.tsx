import toast from 'react-hot-toast';
import { create } from '@ebay/nice-modal-react';

import { ConfirmModal } from '../index';

import { useServices } from '../../../services';

import type { Directory, File } from '../../../state/files.state';

interface DeleteFileModalProps {
  item: Directory | File;
}

export const DeleteFileModal = create<DeleteFileModalProps>(({ item }) => {
  const { filesSvc } = useServices();
  const { type } = item;

  const absolutePath = filesSvc.absolutePath(item);
  const name = item.type === 'file' ? `${absolutePath}.${item.language}` : absolutePath;

  const onSubmit = () => {
    toast.promise(
      type === 'directory'
        ? filesSvc.removeDirectory(item.id)
        : filesSvc.removeFile(item.id),
      {
        loading: 'Deleting...',
        success: (
          <div>
            <span className="block text-bold">
              {type === 'file' ? 'File' : 'Directory'} succesfully deleted!
            </span>
          </div>
        ),
        error: (
          <div>
            <span className="block text-bold text-red-400">
              Failed to delete {type}.
            </span>
          </div>
        ),
      }
    );
  };

  return (
    <ConfirmModal
      title={`Delete the ${name} ${type}`}
      confirmText="Delete"
      onSubmit={onSubmit}
      confirmDisabled={false}
      onlyConfirm={true}
    >
      <div className="flex content-center justify-center">
        <p>
          Are you sure you want to delete the {name} {type}? This operation will be permament.
        </p>
      </div>
    </ConfirmModal>
  );
});
