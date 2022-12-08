import { useState } from 'react';
import toast from 'react-hot-toast';
import { create } from '@ebay/nice-modal-react';

import { ConfirmModal } from '../index';

import { useServices } from '../../../services';

import type { Directory, File } from '../../../state/files.state';

interface EditFileModalProps {
  item: Directory | File;
}

export const EditFileModal = create<EditFileModalProps>(({ item }) => {
  const [url, setUrl] = useState('');
  const { filesSvc } = useServices();
  const { type } = item;

  const absolutePath = filesSvc.absolutePath(item);
  const name = item.type === 'file' ? `${absolutePath}.${item.language}` : absolutePath;

  const onSubmit = () => {
    toast.promise(
      type === 'directory'
        ? filesSvc.updateDirectory(item.id, item)
        : filesSvc.updateFile(item.id, item),
      {
        loading: 'Renaming...',
        success: (
          <div>
            <span className="block text-bold">
              {type === 'file' ? 'File' : 'Directory'} succesfully renamed!
            </span>
          </div>
        ),
        error: (
          <div>
            <span className="block text-bold text-red-400">
              Failed to rename {type}.
            </span>
          </div>
        ),
      }
    );
  };

  return (
    <ConfirmModal
      title={`Rename the ${name} ${type}`}
      confirmText="Rename"
      confirmDisabled={!url}
      onSubmit={onSubmit}
    >
      <div className="flex content-center justify-center">
        <label
          htmlFor="url"
          className="flex justify-right items-center content-center text-sm font-medium text-gray-700 hidden"
        >
          Document URL
        </label>
        <input
          type="url"
          name="url"
          placeholder="Paste URL here"
          className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 text-gray-700 border-pink-300 border-2"
          onChange={e => setUrl(e.target.value)}
        />
      </div>
    </ConfirmModal>
  );
});
