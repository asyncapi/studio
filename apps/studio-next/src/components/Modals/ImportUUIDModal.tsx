import { useState } from 'react';
import toast from 'react-hot-toast';
import { create } from '@ebay/nice-modal-react';

import { ConfirmModal } from './index';

import { useServices } from '../../services';

export const ImportUUIDModal = create(() => {
  const [shareID, setShareID] = useState('');
  const { editorSvc } = useServices();

  const onSubmit = () => {
    toast.promise(editorSvc.importFromShareID(shareID), {
      loading: 'Importing...',
      success: (
        <div>
          <span className="block text-bold">
            Document succesfully imported!
          </span>
        </div>
      ),
      error: (
        <div>
          <span className="block text-bold text-red-400">
            Failed to import document.
          </span>
        </div>
      ),
    });
  };

  return (
    <ConfirmModal
      title="Import AsyncAPI document from Shared UUID"
      confirmText="Import"
      confirmDisabled={!shareID}
      onSubmit={onSubmit}
    >
      <div className="flex content-center justify-center">
        <label
          htmlFor="url"
          className="flex justify-right items-center content-center text-sm font-medium text-gray-700 hidden"
        >
          Shared UUID
        </label>
        <input
          type="url"
          name="url"
          placeholder="Paste UUID here"
          className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 text-gray-700 border-pink-300 border-2"
          onChange={e => setShareID(e.target.value)}
        />
      </div>
    </ConfirmModal>
  );
});
