import { useState } from 'react';
import toast from 'react-hot-toast';
import { create } from '@ebay/nice-modal-react';

import { ConfirmModal } from '../index';

import { useServices } from '../../../services';

import type { Directory } from '../../../state/files.state';

interface CreateNewDirectoryModalProps {
  directory: Directory;
}

export const CreateNewDirectoryModal = create<CreateNewDirectoryModalProps>(({ directory }) => {
  const [uri, setUri] = useState('');
  const { filesSvc } = useServices();
  directory = directory || filesSvc.getRootDirectory();
  const absolutePath = filesSvc.absolutePath(directory);

  const onSubmit = () => {
    toast.promise(filesSvc.createDirectory(uri, { parent: directory }), {
      loading: 'Creating...',
      success: (
        <div>
          <span className="block text-bold">
            Directory succesfully created!
          </span>
        </div>
      ),
      error: (
        <div>
          <span className="block text-bold text-red-400">
            Failed to create directory.
          </span>
        </div>
      ),
    });
  };

  return (
    <ConfirmModal
      title={`Create new directory on ${absolutePath || 'root'} location`}
      confirmText="Create"
      confirmDisabled={!uri}
      onSubmit={onSubmit}
    >
      <div className="flex content-center justify-center">
        <label
          htmlFor="directoryName"
          className="flex justify-right items-center content-center text-sm font-medium text-gray-700 hidden"
        >
          Directory name
        </label>
        <input
          type="directoryName"
          name="directoryName"
          placeholder="Write directory name here"
          className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 text-gray-700 border-pink-300 border-2"
          onChange={e => setUri(e.target.value)}
        />
      </div>
    </ConfirmModal>
  );
});
