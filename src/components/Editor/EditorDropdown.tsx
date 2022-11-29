import React from 'react';
import toast from 'react-hot-toast';
import { FaEllipsisH } from 'react-icons/fa';
import { hasErrorDiagnostic } from '@asyncapi/parser/cjs/utils';

import {
  ConvertModal,
  GeneratorModal,
  ImportBase64Modal,
  ImportURLModal,
} from '../Modals';
import { Dropdown } from '../common';

import { useServices } from '../../services';
import state from '../../state';

interface EditorDropdownProps {}

export const EditorDropdown: React.FunctionComponent<EditorDropdownProps> = () => {
  const { editorSvc } = useServices();
  const editorState = state.useEditorState();
  const parserState = state.useParserState();

  const language = editorState.language.get();
  const hasParserErrors = hasErrorDiagnostic(parserState.diagnostics.get());

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

  const saveFileButton = (
    <button
      type="button"
      className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150"
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
      disabled={hasParserErrors}
    >
      Save as {language === 'yaml' ? 'YAML' : 'JSON'}
    </button>
  );

  const convertLangAndSaveButton = (
    <button
      type="button"
      className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150"
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
      disabled={hasParserErrors}
    >
      Convert and save as {language === 'yaml' ? 'JSON' : 'YAML'}
    </button>
  );

  const convertLangButton = (
    <button
      type="button"
      className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150"
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
      disabled={hasParserErrors}
    >
      Convert to {language === 'yaml' ? 'JSON' : 'YAML'}
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
            <ImportURLModal />
          </li>
          <li className="hover:bg-gray-900">
            {importFileButton}
          </li>
          <li className="hover:bg-gray-900">
            <ImportBase64Modal />
          </li>
        </div>
        <div className="border-b border-gray-700">
          <li className="hover:bg-gray-900">
            <GeneratorModal />
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
            <ConvertModal />
          </li>
        </div>
      </ul>
    </Dropdown>
  );
};
