import { VscAdd } from 'react-icons/vsc';

import { Tabs } from './Tabs';
import { Dropdown } from './Dropdown';

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

        <IconButton
          icon={<VscAdd className='w-3.5 h-3.5' />}
          tooltip={{
            content: 'Open new tab',
            delay: [500, 0],
          }} 
          onClick={e => {
            e.stopPropagation();
          }}
        />
      </div>

      <div className='flex-none flex flex-row'>
        <Dropdown />
      </div>
    </div>
  );
};
