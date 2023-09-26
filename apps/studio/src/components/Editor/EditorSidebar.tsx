import React from 'react';

import { EditorDropdown } from './EditorDropdown';

import { useFilesState } from '../../state';

interface EditorSidebarProps {}

export const EditorSidebar: React.FunctionComponent<EditorSidebarProps> = () => {
  const { source, from } = useFilesState(state => state.files['asyncapi']);

  let documentFromText = '';
  if (from === 'storage') {
    documentFromText = 'From localStorage';
  } else if (from === 'base64') {
    documentFromText = 'From Base64';
  } else {
    documentFromText = `From URL ${source}`;
  }

  return (
    <div
      className="flex flex-row items justify-between bg-gray-800 border-b border-gray-700 text-sm"
      style={{ height: '30px', lineHeight: '30px' }}
    >
      <div className="ml-2 text-gray-500 text-xs italic" style={{ height: '30px', lineHeight: '30px' }}>
        {documentFromText}
      </div>
      <div
        className="flex flex-row items-center"
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
