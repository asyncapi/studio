import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { ConfirmModal } from './index';

import { useServices } from '../../services';

export const ImportURLModal: React.FunctionComponent = () => {
  const [url, setUrl] = useState('');
  const { editorSvc } = useServices();

  const onSubmit = () => {
    toast.promise(editorSvc.importFromURL(url), {
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
      title="Import AsyncAPI document from URL"
      confirmText="Import"
      confirmDisabled={!url}
      opener={
        <button
          type="button"
          className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150"
          title="Import from URL"
        >
          Import from URL
        </button>
      }
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
};
