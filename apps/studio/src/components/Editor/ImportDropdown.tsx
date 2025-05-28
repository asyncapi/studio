import React from 'react';
import toast from 'react-hot-toast';
import { show } from '@ebay/nice-modal-react';
import { FaFileImport } from 'react-icons/fa';

import {
  ImportURLModal,
  ImportBase64Modal,
  ImportUUIDModal,
} from '../Modals';

import { Dropdown, Tooltip } from '../common';
import { useServices } from '@/services';

export const ImportDropdown: React.FC = () => {
  const { editorSvc } = useServices();

  return (
    <Dropdown 
      opener={
        <Tooltip content="Import" placement="top" hideOnClick={true}>
          <button className="bg-inherit">
            <FaFileImport />
          </button>
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
          <label
            className="block px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150 cursor-pointer"
            title="Import File"
          >
            <input
              type="file"
              accept='.yaml, .yml, .json'
              style={{ position: 'fixed', top: '-100em' }}
              onChange={event => {
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
              }}
            />
            Import File
          </label>
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
  );
}
