import { useState } from 'react';
import toast from 'react-hot-toast';
import { create } from '@ebay/nice-modal-react';

import { ConfirmModal } from '../index';

import { useServices } from '../../../services';

import type { Directory } from '../../../state/files.state';

interface CreateNewFileModalProps {
  directory: Directory;
}

export const CreateNewFileModal = create<CreateNewFileModalProps>(({ directory }) => {
  const [uri, setUri] = useState('');
  const { filesSvc } = useServices();
  directory = directory || filesSvc.getRootDirectory();
  const absolutePath = filesSvc.absolutePath(directory);

  const onSubmit = () => {
    const [name, language] = uri.split('.');
    toast.promise(filesSvc.createFile({ name, language: language as 'json' | 'yaml', uri, parent: directory }), {
      loading: 'Creating...',
      success: (
        <div>
          <span className="block text-bold">
            File succesfully created!
          </span>
        </div>
      ),
      error: (
        <div>
          <span className="block text-bold text-red-400">
            Failed to create file.
          </span>
        </div>
      ),
    });
  };

  return (
    <ConfirmModal
      title={`Create new file on ${absolutePath || 'root'} location`}
      confirmText="Create"
      confirmDisabled={!uri}
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
          onChange={e => setUri(e.target.value)}
        />
      </div>
    </ConfirmModal>
  );
});
