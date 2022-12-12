import { VscSaveAll, VscCloseAll } from 'react-icons/vsc';

import { Tabs } from './Tabs';
// import { Dropdown } from './Dropdown';
import { Dropdown } from './NewDropdown';

import { IconButton } from '../common';

import type { FunctionComponent } from 'react';

interface SidebarProps {}

export const Sidebar: FunctionComponent<SidebarProps> = () => {
  return (
    <div className="flex flex-row items-center justify-between bg-gray-800 border-b border-gray-700">
      <div className='flex-1 flex items-center'>
        <div className='mr-2'>
          <Tabs />
        </div>
      </div>

      <div className='flex-none flex flex-row'>
        <ul className='flex flex-row items-center justify-between'>
          <li>
            <IconButton
              icon={<VscSaveAll className='w-4 h-4' />}
              tooltip={{
                content: 'Save all',
                delay: [500, 0],
              }} 
              onClick={e => {
                e.stopPropagation();
              }}
            />
          </li>
          <li className='ml-1'>
            <IconButton
              icon={<VscCloseAll className='w-4 h-4' />}
              tooltip={{
                content: 'Close all tabs',
                delay: [500, 0],
              }} 
              onClick={e => {
                e.stopPropagation();
              }}
            />
          </li>
          <li className='ml-1 mr-2'>
            <Dropdown />
          </li>
        </ul>
      </div>
    </div>
  );
};
