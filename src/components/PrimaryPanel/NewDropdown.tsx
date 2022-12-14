import { Fragment } from 'react';
import { VscArrowDown, VscArrowUp, VscArrowSwap, VscEllipsis, VscSettingsGear, VscSaveAs } from 'react-icons/vsc';
import { Menu, Transition } from '@headlessui/react';
import { show } from '@ebay/nice-modal-react';

import { SettingsModal } from '../Modals';
import { IconButton } from '../common';

import type { FunctionComponent } from 'react';

interface DropdownProps {}

export const Dropdown: FunctionComponent<DropdownProps> = () => {
  return (
    <div className="flex-none flex flex-col items-center justify-between">
      <Menu as="div" className="relative inline-block">
        <Menu.Button as='div'>
          <IconButton
            icon={<VscEllipsis className='w-4 h-4' />}
            tooltip={{
              content: 'More actions...',
              delay: [500, 0],
            }} 
          />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-4 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
            <div className="px-1 py-1 ">
              <Menu.Item>
                <button className='text-gray-900 hover:bg-pink-500 hover:text-white group flex w-full items-center rounded-md px-2 py-2 text-sm'>
                  <VscArrowDown
                    className="mr-2 w-4 h-4 text-pink-500 group-hover:text-white"
                    aria-hidden="true"
                  />
                  Import document
                </button>
              </Menu.Item>
              <Menu.Item>
                <button className='text-gray-900 hover:bg-pink-500 hover:text-white group flex w-full items-center rounded-md px-2 py-2 text-sm'>
                  <VscArrowUp
                    className="mr-2 w-4 h-4 text-pink-500 group-hover:text-white"
                    aria-hidden="true"
                  />
                  Share document
                </button>
              </Menu.Item>
            </div>
            <div className="px-1 py-1">
              <Menu.Item>
                <button className='text-gray-900 hover:bg-pink-500 hover:text-white group flex w-full items-center rounded-md px-2 py-2 text-sm'>
                  <VscSaveAs
                    className="mr-2 w-4 h-4 text-pink-500 group-hover:text-white"
                    aria-hidden="true"
                  />
                  Save document as 
                </button>
              </Menu.Item>
              <Menu.Item>
                <button className='text-gray-900 hover:bg-pink-500 hover:text-white group flex w-full items-center rounded-md px-2 py-2 text-sm'>
                  <VscArrowSwap
                    className="mr-2 w-4 h-4 text-pink-500 group-hover:text-white"
                    aria-hidden="true"
                  />
                  Convert document
                </button>
              </Menu.Item>
            </div>
            <div className="px-1 py-1">
              <Menu.Item>
                <button 
                  className='text-gray-900 hover:bg-pink-500 hover:text-white group flex w-full items-center rounded-md px-2 py-2 text-sm'
                  onClick={() => {
                    show(SettingsModal, { activeTab: 'editor' })
                  }}
                >
                  <VscSettingsGear
                    className="mr-2 w-4 h-4 text-pink-500 group-hover:text-white"
                    aria-hidden="true"
                  />
                  Settings
                </button>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
