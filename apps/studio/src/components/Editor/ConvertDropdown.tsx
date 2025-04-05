import React from 'react';
import { show } from '@ebay/nice-modal-react';
import toast from 'react-hot-toast';
import { FaFileExport } from 'react-icons/fa';

import { ConvertModal } from '../Modals';
import { Dropdown, Tooltip } from '../common';
import { useServices } from '@/services';
import { useDocumentsState, useFilesState } from '../../state';

export const ConvertDropdown: React.FC = () => {
  const { editorSvc } = useServices();
  const isInvalidDocument = !useDocumentsState(state => 
    state.documents['asyncapi'].valid
  );
  const language = useFilesState(state => state.files['asyncapi'].language);
      
  return (
    <Dropdown
      opener={
        <Tooltip content="Convert" placement="top" hideOnClick={true}>
          <button className="bg-inherit">
            <FaFileExport />
          </button>
        </Tooltip>
      }
      buttonHoverClassName="text-gray-500 hover:text-white"
      dataTest="button-convert-dropdown"
    >
      <ul className="bg-gray-800 text-md text-white">
        <li className="hover:bg-gray-900">
          <button
            type="button"
            className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150 disabled:cursor-not-allowed"
            title={`Convert to ${language === 'yaml' ? 'JSON' : 'YAML'}`}
            onClick={() => {
              toast.promise(
                language === 'yaml'
                  ? editorSvc.convertToJSON()
                  : editorSvc.convertToYaml(),
                {
                  loading: 'Saving...',
                  success: (
                    <div>
                      <span className="block text-bold">
                        Document succesfully converted!
                      </span>
                    </div>
                  ),
                  error: (
                    <div>
                      <span className="block text-bold text-red-400">
                        Failed to convert document.
                      </span>
                    </div>
                  ),
                },
              );
            }}
            disabled={isInvalidDocument}
          >
            Convert to {language === 'yaml' ? 'JSON' : 'YAML'}
          </button>
        </li>
        <li className="hover:bg-gray-900">
          <button
            type="button"
            className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150"
            title="Convert AsyncAPI document"
            onClick={() => show(ConvertModal)}
          >
                Convert document
          </button>
        </li>
      </ul>

    </Dropdown>
  );
}

