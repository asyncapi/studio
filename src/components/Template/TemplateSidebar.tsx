import React from 'react';

import { TemplateDropdown } from './TemplateDropdown';

interface TemplateSidebarProps {}

export const TemplateSidebar: React.FunctionComponent<TemplateSidebarProps> = () => {
  return (
    <div
      className="flex flex-row items justify-between bg-gray-800 border-b border-gray-700 text-sm"
      style={{ height: '30px', lineHeight: '30px' }}
    >
      <div />
      <div
        className="flex flex-row items-center"
        style={{ height: '30px', lineHeight: '30px' }}
      >
        <div>
          <ul className="flex">
            <li>
              <TemplateDropdown />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
