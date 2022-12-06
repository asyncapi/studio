import React from 'react';
import toast from 'react-hot-toast';
import { show } from '@ebay/nice-modal-react';
import { FaEllipsisH } from 'react-icons/fa';

import {
  ImportURLModal,
  ImportBase64Modal,
  GeneratorModal,
  ConvertModal,
} from '../Modals';
import { Dropdown } from '../common';

import { useServices } from '../../services';
import { useDocumentsState, useFilesState } from '../../state';

interface EditorDropdownProps {}

export const EditorDropdown: React.FunctionComponent<EditorDropdownProps> = () => {
  const { editorSvc } = useServices();
  const isInvalidDocument = !useDocumentsState(state => state.documents['asyncapi'].valid);
  const language = useFilesState(state => state.files['asyncapi'].language);

  const importUrlButton = (
    <button
      type="button"
      className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150"
      title="Import from URL"
      onClick={() => show(ImportURLModal)}
    >
      Import from URL
    </button>
  );

  const importFileButton = (
    <label
      className="block px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150 cursor-pointer"
      title="Import File"
    >
      <input
        type="file"
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
                Failed to import document.
                </span>
              </div>
            ),
          });
        }}
      />
      Import File
    </label>
  );

  const importBase64Button = (
    <button
      type="button"
      className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150"
      title="Import from Base64"
      onClick={() => show(ImportBase64Modal)}
    >
      Import from Base64
    </button>
  );

  const generateButton = (
    <button
      type="button"
      className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150 disabled:cursor-not-allowed"
      title="Generate code/docs"
      disabled={isInvalidDocument}
      onClick={() => show(GeneratorModal)}
    >
      Generate code/docs
    </button>
  );

  const saveFileButton = (
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
  );

  const convertLangAndSaveButton = (
    <button
      type="button"
      className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150 disabled:cursor-not-allowed"
      title={`Convert and save as ${
        language === 'yaml' ? 'JSON' : 'YAML'
      }`}
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
  );

  const convertLangButton = (
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
  );

  const convertButton = (
    <button
      type="button"
      className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150"
      title="Convert AsyncAPI document"
      onClick={() => show(ConvertModal)}
    >
      Convert document
    </button>
  );

  return (
    <Dropdown
      opener={<FaEllipsisH />}
      buttonHoverClassName="text-gray-500 hover:text-white"
    >
      <ul className="bg-gray-800 text-md text-white">
        <div className="border-b border-gray-700">
          <li className="hover:bg-gray-900">
            {importUrlButton}
          </li>
          <li className="hover:bg-gray-900">
            {importFileButton}
          </li>
          <li className="hover:bg-gray-900">
            {importBase64Button}
          </li>
        </div>
        <div className="border-b border-gray-700">
          <li className="hover:bg-gray-900">
            {generateButton}
          </li>
        </div>
        <div className="border-b border-gray-700">
          <li className="hover:bg-gray-900">
            {saveFileButton}
          </li>
          <li className="hover:bg-gray-900">
            {convertLangAndSaveButton}
          </li>
        </div>
        <div>
          <li className="hover:bg-gray-900">
            {convertLangButton}
          </li>
          <li className="hover:bg-gray-900">
            {convertButton}
          </li>
        </div>
      </ul>
    </Dropdown>
  );
};
