import React from 'react';
import { show } from '@ebay/nice-modal-react';
import { FaCode } from 'react-icons/fa';
import toast from 'react-hot-toast';

import { GeneratorModal } from '../Modals';
import { Dropdown, Tooltip } from '../common';
import { useDocumentsState } from '../../state';
import { useServices } from '@/services';

export const GenerateDropdown: React.FC = () => {
  const isInvalidDocument = !useDocumentsState(state => 
    state.documents['asyncapi'].valid
  );
  const { editorSvc } = useServices();

  return (
    <Dropdown
      opener={
        <Tooltip content="Generate" placement="top" hideOnClick={true}>
          <button className="bg-inherit">
            <FaCode />
          </button>
        </Tooltip>
      }
      buttonHoverClassName="text-gray-500 hover:text-white"
      dataTest="button-generate-dropdown"
    >
      <ul className="bg-gray-800 text-md text-white">
        <li className="hover:bg-gray-900">
          <button
            type="button"
            className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150 disabled:cursor-not-allowed"
            title="Generate code/docs"
            disabled={isInvalidDocument}
            onClick={() => show(GeneratorModal)}
          >
                Generate code/docs
          </button>
        </li>
        <li className="hover:bg-gray-900">
          <button 
            type="button"
            className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150 disabled:cursor-not-allowed"
            title='Share as Base64'
            onClick={() => {
              toast.promise(
                (async function () {
                  const base64 = await editorSvc.exportAsBase64();
                  const url = `${window.location.origin}/?base64=${encodeURIComponent(
                    base64
                  )}`;
                  await navigator.clipboard.writeText(url);
                }()),
                {
                  loading: 'Copying URL to clipboard...',
                  success: 'URL copied to clipboard!',
                  error: 'Failed to copy URL to clipboard.',
                }
              );
            }}>
                Share as Base64
          </button>
        </li>
      </ul>
    </Dropdown>
  );
};