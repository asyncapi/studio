import React from 'react';
import toast from 'react-hot-toast';
import { FaEllipsisH } from 'react-icons/fa';

import {
  ConverterModal,
  ExportToLinkModal,
  ImportURLModal,
  ImportBase64Modal,
  ShareBase64Modal,
} from '../Modals';
import { Dropdown } from '../common';

import { EditorService } from '../../services';
import state from '../../state';

interface EditorDropdownProps {}

export const EditorDropdown: React.FunctionComponent<EditorDropdownProps> = () => {
  const editorState = state.useEditorState();
  const parserState = state.useParserState();

  const language = editorState.language.get();
  const hasParserErrors = parserState.errors.get().length > 0;

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
            <label
              className="block px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150 cursor-pointer"
              title="Import File"
            >
              <input
                type="file"
                style={{ position: 'fixed', top: '-100em' }}
                onChange={event => {
                  toast.promise(EditorService.importFile(event.target.files), {
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
          </li>
          <li className="hover:bg-gray-900">
            <ImportBase64Modal />
          </li>
        </div>
        <div className="border-b border-gray-700">
          <li className="hover:bg-gray-900">
            <button
              type="button"
              className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150"
              title={`Save as ${language === 'yaml' ? 'YAML' : 'JSON'}`}
              onClick={() => {
                toast.promise(
                  language === 'yaml'
                    ? EditorService.saveAsYaml()
                    : EditorService.saveAsJson(),
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
          </li>
          <li className="hover:bg-gray-900">
            <button
              type="button"
              className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150"
              title={`Convert and save as ${
                language === 'yaml' ? 'JSON' : 'YAML'
              }`}
              onClick={() => {
                toast.promise(
                  language === 'yaml'
                    ? EditorService.saveAsJson()
                    : EditorService.saveAsJson(),
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
          </li>
        </div>
        <div className="border-b border-gray-700">
          <li className="hover:bg-gray-900">
            <ShareBase64Modal />
          </li>
          <li className="hover:bg-gray-900">
            <ExportToLinkModal />
          </li>
        </div>
        <div>
          <li className="hover:bg-gray-900">
            <button
              type="button"
              className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150"
              title={`Convert to ${language === 'yaml' ? 'JSON' : 'YAML'}`}
              onClick={() => {
                toast.promise(
                  language === 'yaml'
                    ? EditorService.convertToJson()
                    : EditorService.convertToYaml(),
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
          </li>
          <li className="hover:bg-gray-900">
            <ConverterModal />
          </li>
        </div>
      </ul>
    </Dropdown>
  );
};
