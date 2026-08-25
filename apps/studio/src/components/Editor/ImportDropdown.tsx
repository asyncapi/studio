import React, { useRef } from 'react';
import toast from 'react-hot-toast';
import { show } from '@ebay/nice-modal-react';
import { UploadIcon } from '@asyncapi/studio-ui/icons';

import {
  ImportURLModal,
  ImportBase64Modal,
  ImportUUIDModal,
  OpenFolderModal,
} from '../Modals';

import { Dropdown, Tooltip } from '../common';
import { useServices } from '@/services';

export const ImportDropdown: React.FC = () => {
  const { editorSvc } = useServices();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    toast.promise(editorSvc.importFile(event.target.files), {
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
            Failed to import document. Maybe the file type is invalid.
          </span>
        </div>
      ),
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".yaml, .yml, .json, .avsc"
        aria-hidden="true"
        tabIndex={-1}
        style={{ position: 'fixed', top: '-100em' }}
        onChange={handleFileChange}
      />
      <Dropdown
        opener={
          <Tooltip content="Import" placement="top" hideOnClick={true}>
            <span>
              <UploadIcon className="w-4 h-4" />
            </span>
          </Tooltip>
        }
        buttonHoverClassName="text-gray-500 hover:text-white"
        dataTest="button-import-dropdown"
      >
        <ul className="bg-gray-800 text-md text-white">
          <li className="hover:bg-gray-900">
            <button
              type="button"
              className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150"
              title="Import from URL"
              onClick={() => show(ImportURLModal)}
            >
              Import from URL
            </button>
          </li>

          <li className="hover:bg-gray-900">
            <button
              type="button"
              className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150"
              title="Open Folder"
              onClick={() => show(OpenFolderModal)}
            >
              Open Folder
            </button>
          </li>

          <li className="hover:bg-gray-900">
            <button
              type="button"
              className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150"
              title="Import File"
              onClick={() => fileInputRef.current?.click()}
            >
              Import File
            </button>
          </li>

          <li className="hover:bg-gray-900">
            <button
              type="button"
              className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150"
              title="Import from Base64"
              onClick={() => show(ImportBase64Modal)}
            >
              Import from Base64
            </button>
          </li>

          <li className="hover:bg-gray-900">
            <button
              type="button"
              className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150"
              title="Import from UUID"
              onClick={() => show(ImportUUIDModal)}
            >
              Import from UUID
            </button>
          </li>
        </ul>
      </Dropdown>
    </>
  );
};
