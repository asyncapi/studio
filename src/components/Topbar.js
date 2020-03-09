import { useState } from 'react'
import UserMenu from './UserMenu'
import IconMenu from './icons/menu'

export default function Topbar ({ active }) {
  const [open, setOpen] = useState(false);

  const classes = 'px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:text-white focus:bg-gray-700 mr-4'
  const activeClasses = `${classes} text-white bg-gray-900`
  const regularClasses = `${classes} text-gray-300 hover:text-white hover:bg-gray-700`

  return (
    <nav className="bg-gray-800 z-30">
      <div className="sm:px-6 lg:px-8 border-b border-gray-700">
        <div className="flex items-center justify-between h-16 px-4 sm:px-0">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img className="inline-flex h-20" src="/img/logo-horizontal-white.svg" alt="" />
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline">
                <a href="/" className={active === 'editor' ? activeClasses : regularClasses}>Editor</a>
                <a href="/directory" className={active === 'directory' ? activeClasses : regularClasses}>Directory</a>
              </div>
            </div>
          </div>
          <UserMenu />
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setOpen(!open)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white">
              <IconMenu open={open} />
            </button>
          </div>
        </div>
      </div>
      { open &&
        <div className="border-b border-gray-700 md:hidden">
          <div className="px-2 py-3 sm:px-3">
            <a href="/" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900 focus:outline-none focus:text-white focus:bg-gray-700">Editor</a>
            <a href="/explorer" className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700">Explorer</a>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <img className="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium leading-none text-white">Tom Cook</div>
                <div className="mt-1 text-sm font-medium leading-none text-gray-400">tom@example.com</div>
              </div>
            </div>
            <div className="mt-3 px-2">
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700">Your Profile</a>
              <a href="#" className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700">Settings</a>
              <a href="#" className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700">Sign out</a>
            </div>
          </div>
        </div>
      }
    </nav>
  )
}
