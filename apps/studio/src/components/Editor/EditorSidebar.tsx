import React from 'react';

import { useFilesState } from '../../state';
import { ShareButton } from './ShareButton';
import { ImportDropdown } from './ImportDropdown';
import { GenerateDropdown } from './GenerateDropdown';
import { SaveDropdown } from './SaveDropdown';
import { ConvertDropdown } from './ConvertDropdown';

interface EditorSidebarProps {}

export const EditorSidebar: React.FunctionComponent<
  EditorSidebarProps
> = () => {
  const { source, from } = useFilesState((state) => state.files['asyncapi']);

  let documentFromText = '';
  if (from === 'storage') {
    documentFromText = 'From localStorage';
  } else if (from === 'base64') {
    documentFromText = 'From Base64';
  } else if (from === 'share') {
    documentFromText = 'From Shared';
  } else {
    documentFromText = `From URL ${source}`;
  }

  return (
    <div
      className="flex flex-row items justify-between bg-slate-200 dark:bg-gray-800 border-b border-black dark:border-gray-700 text-sm"
      style={{ height: '30px', lineHeight: '30px' }}
    >
      <div
        className="ml-2 text-gray-700 dark:text-gray-500 text-xs italic"
        style={{ height: '30px', lineHeight: '30px' }}
      >
        {documentFromText}
      </div>
      <div
        className="flex flex-row items-center"
        style={{ height: '30px', lineHeight: '30px' }}
      >
        <div id="editor-dropdown">
          <ul className="flex">
            <li>
              <ImportDropdown />
            </li>
            <li>
              <GenerateDropdown />
            </li>
            <li>
              <SaveDropdown />
            </li>
            <li>
              <ConvertDropdown />
            </li>
            <li>
              <ShareButton />
            </li>
            {/* <li>
              <EditorDropdown />
            </li> */}
            
          </ul>
        </div>
      </div>
    </div>
  );
};
