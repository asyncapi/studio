import React from 'react';

import { EditorDropdown } from './EditorDropdown';

import { EditorService, NavigationService, SpecificationService } from '../../services';
import state from '../../state';

interface EditorSidebarProps {}

export const EditorSidebar: React.FunctionComponent<EditorSidebarProps> = () => {
  const editorState = state.useEditorState();
  const documentFrom = editorState.documentFrom.get();

  let documentFromText = '';
  if (documentFrom === 'localStorage') {
    documentFromText = 'From localStorage';
  } else if (documentFrom === 'Base64') {
    documentFromText = 'From Base64 query';
  } else {
    documentFromText = 'From URL query';
  }

  return (
    <div
      className="flex flex-row items-center justify-between bg-gray-800 border-b border-gray-700 text-sm"
      style={{ height: '30px', lineHeight: '30px' }}
    >
      <div className='flex flex-row items-center justify-between'>
        <span className='inline-block ml-2 text-gray-500 text-xs italic'>
          {documentFromText}
        </span>

        {documentFrom !== 'localStorage' ? (
          <div className='ml-2 flex flex-row items-center justify-between'>
            <button 
              type='button' 
              className='px-2 py-0.5 rounded text-gray-300 text-xs bg-gray-600 hover:bg-gray-700 cursor-pointer'
              onClick={(e) => {
                e.stopPropagation();
                EditorService.saveToLocalStorage(undefined, false);
                NavigationService.removeQueryParameters(['url', 'base64']);
                SpecificationService.parseSpec();
              }}
            >
              Save in storage
            </button>
            <button 
              type='button' 
              className='ml-2 px-2 py-0.5 rounded text-gray-300 text-xs bg-gray-600 hover:bg-gray-700 cursor-pointer'
              onClick={(e) => {
                e.stopPropagation();
                EditorService.loadFromLocalStorage();
                NavigationService.removeQueryParameters(['url', 'base64']);
              }}
            >
              Load from storage
            </button>
          </div>
        ) : null}
      </div>
      <div
        className="flex flex-row items-center justify-between"
        style={{ height: '30px', lineHeight: '30px' }}
      >
        <div>
          <ul className="flex">
            <li>
              <EditorDropdown />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
