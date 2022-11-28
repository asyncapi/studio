import React from 'react';

import { EditorDropdown } from './EditorDropdown';

import state from '../../state';

interface EditorSidebarProps {}

export const EditorSidebar: React.FunctionComponent<EditorSidebarProps> = () => {
  const editorState = state.useEditorState();
  const documentFrom = editorState.documentFrom.get();

  let documentFromText = '';
  if (documentFrom === 'localStorage') {
    documentFromText = 'From localStorage';
  } else if (documentFrom === 'base64') {
    documentFromText = 'From Base64';
  } else {
    const documentSource = editorState.documentSource.get();
    documentFromText = `From URL ${documentSource}`;
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
