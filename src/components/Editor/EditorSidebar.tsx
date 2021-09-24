import React from 'react';

import { EditorDropdown } from './EditorDropdown';

interface EditorSidebarProps {}

export const EditorSidebar: React.FunctionComponent<EditorSidebarProps> = () => {
  return (
    <div
      className="bg-gray-800 border-b border-gray-700 text-sm"
      style={{ height: '30px', lineHeight: '30px' }}
    >
      <div
        className="flex flex-row items-center justify-end"
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
