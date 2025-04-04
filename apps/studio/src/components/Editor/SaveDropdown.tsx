import React from 'react';
import toast from 'react-hot-toast';
import { FaSave } from 'react-icons/fa';

import { Dropdown, Tooltip } from '../common';
import { useServices } from '@/services';
import { useDocumentsState, useFilesState } from '../../state';

export const SaveDropdown: React.FC = () => {
  const { editorSvc } = useServices();
  const isInvalidDocument = !useDocumentsState(state => 
    state.documents['asyncapi'].valid
  );
  const language = useFilesState(state => state.files['asyncapi'].language);

  return (
    <Dropdown
      opener={
        <Tooltip content="Save" placement="top" hideOnClick={true}>
          <button className="bg-inherit">
            <FaSave />
          </button>
        </Tooltip>
      }
      buttonHoverClassName="text-gray-500 hover:text-white"
      dataTest="button-save-dropdown"
    >
      <ul className="bg-gray-800 text-md text-white">
        <li className="hover:bg-gray-900">
          <button
            type="button"
            className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150 disabled:cursor-not-allowed"
            title={`Save as ${language === 'yaml' ? 'YAML' : 'JSON'}`}
            onClick={() => {
              toast.promise(
                language === 'yaml'
                  ? editorSvc.saveAsYaml()
                  : editorSvc.saveAsJSON(),
                {
                  loading: 'Saving...',
                  success: (
                    <div>
                      <span className="block text-bold">
                        Document succesfully saved!
                      </span>
                    </div>
                  ),
                  error: (
                    <div>
                      <span className="block text-bold text-red-400">
                        Failed to save document.
                      </span>
                    </div>
                  ),
                },
              );
            }}
            disabled={isInvalidDocument}
          >
            Save as {language === 'yaml' ? 'YAML' : 'JSON'}
          </button>
        </li>
        <li className="hover:bg-gray-900">
          <button
            type="button"
            className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150 disabled:cursor-not-allowed"
            title={`Convert and save as ${language === 'yaml' ? 'JSON' : 'YAML'}`}
            onClick={() => {
              toast.promise(
                language === 'yaml'
                  ? editorSvc.saveAsJSON()
                  : editorSvc.saveAsYaml(),
                {
                  loading: 'Saving...',
                  success: (
                    <div>
                      <span className="block text-bold">
                        Document succesfully converted and saved!
                      </span>
                    </div>
                  ),
                  error: (
                    <div>
                      <span className="block text-bold text-red-400">
                        Failed to convert and save document.
                      </span>
                    </div>
                  ),
                },
              );
            }}
            disabled={isInvalidDocument}
          >
            Convert and save as {language === 'yaml' ? 'JSON' : 'YAML'}
          </button>
        </li>
       
      </ul>
    </Dropdown>
  );
};