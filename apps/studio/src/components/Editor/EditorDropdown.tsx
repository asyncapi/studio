import React from 'react';
import toast from 'react-hot-toast';
import { show } from '@ebay/nice-modal-react';
import { FaEllipsisH } from 'react-icons/fa';

import { Dropdown } from '../Common';


interface EditorDropdownProps {}

export const EditorDropdown: React.FunctionComponent<EditorDropdownProps> = () => {
  // TODO: Add services and modals again

  const importUrlButton = (
    <button
      type="button"
      className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150"
      title="Import from URL"
      onClick={() => console.log('TODO: Implement import from URL')}
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
          console.log('TODO: Implement import from file');
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
      onClick={() => console.log('TODO: Implement import from Base64')}
    >
      Import from Base64
    </button>
  );

  const generateButton = (
    <button
      type="button"
      className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150 disabled:cursor-not-allowed"
      title="Generate code/docs"
      disabled={false}
      onClick={() => console.log('TODO: Implement generate code/docs')}
    >
      Generate code/docs
    </button>
  );

  const saveFileButton = (
    <button
      type="button"
      className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150 disabled:cursor-not-allowed"
      // title={`Save as ${language === 'yaml' ? 'YAML' : 'JSON'}`}
      title="Save as YAML"
      onClick={() => {
        console.log('TODO: Implement save as YAML');
      }}
      disabled={false} // Change to isInvalidDocument
    >
      {/* Save as {language === 'yaml' ? 'YAML' : 'JSON'} */}
      Save as YAML
    </button>
  );

  const convertLangAndSaveButton = (
    <button
      type="button"
      className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150 disabled:cursor-not-allowed"
      title={`Convert and save as ${
        // language === 'yaml' ? 'JSON' : 'YAML'
        'JSON'
      }`}
      onClick={() => {
        console.log('TODO: Implement convert and save as JSON/YAML');
      }}
      // disabled={isInvalidDocument}
      disabled={false}
    >
      {/* Convert and save as {language === 'yaml' ? 'JSON' : 'YAML'} */}
      Convert and save as JSON
    </button>
  );

  const convertLangButton = (
    <button
      type="button"
      className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150 disabled:cursor-not-allowed"
      // title={`Convert to ${language === 'yaml' ? 'JSON' : 'YAML'}`}
      title="Convert to JSON"
      onClick={() => {
        // TODO: Implement convert to JSON/YAML
        console.log('TODO: Implement convert to JSON/YAML');
      }}
      // disabled={isInvalidDocument}
      disabled={false}
    >
      {/* Convert to {language === 'yaml' ? 'JSON' : 'YAML'} */}
      Convert to JSON
    </button>
  );

  const convertButton = (
    <button
      type="button"
      className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150"
      title="Convert AsyncAPI document"
      onClick={() => console.log('TODO: Implement convert document')}
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
