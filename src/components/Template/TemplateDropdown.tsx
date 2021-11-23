import React from 'react';
import { FaEllipsisH } from 'react-icons/fa';

import {
  TemplateOptionsModal,
} from '../Modals';
import { Dropdown } from '../common';

interface TemplateDropdownProps {}

export const TemplateDropdown: React.FunctionComponent<TemplateDropdownProps> = () => {
  return (
    <Dropdown
      opener={<FaEllipsisH />}
      buttonHoverClassName="text-gray-500 hover:text-white"
    >
      <ul className="bg-gray-800 text-md text-white">
        <div>
          <li className="hover:bg-gray-900">
            <TemplateOptionsModal />
          </li>
        </div>
      </ul>
    </Dropdown>
  );
};
