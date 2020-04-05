import { useContext, useEffect, useState } from 'react'
import { FaGift } from 'react-icons/fa'
import AppContext from '../contexts/AppContext'

export default function UserMenu () {
  const [open, setOpen] = useState(false)
  const { user } = useContext(AppContext)

  if (!user) {
    return (
      <>
        <a href="/auth/signin" className="inline-flex self-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
          <FaGift className="text-xl mr-2" />
          Request early access
        </a>
        <a href="/auth/signin" className="px-3 py-2 ml-2 rounded-md text-sm font-medium focus:outline-none focus:text-white focus:bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-700">Sign in</a>
      </>
    )
  }

  const { displayName, avatar, company } = user

  useEffect(() => {
    if (open) registerClickAway()
  }, [open])

  const registerClickAway = () => {
    document.removeEventListener("click", unregisterClickAway)
    document.addEventListener("click", unregisterClickAway)

    document.querySelectorAll('iframe').forEach(iframe => {
      iframe.contentWindow.document.removeEventListener("click", unregisterClickAway)
      iframe.contentWindow.document.addEventListener("click", unregisterClickAway)
    })
  }

  const unregisterClickAway = () => {
    setOpen(false)
    document.removeEventListener("click", unregisterClickAway)
    document.querySelectorAll('iframe').forEach(iframe => {
      iframe.contentWindow.document.removeEventListener("click", unregisterClickAway)
    })
  }

  const onClickLogout = () => {
    const form = document.createElement('form');
    form.setAttribute('method', 'post');
    form.setAttribute('action', `/auth/logout`);
    form.setAttribute('style', 'display: none;');
    document.body.appendChild(form);
    form.submit();
  }

  return (
    <div className="ml-2 flex items-center">
      <div className="relative">
        <button onClick={() => setOpen(!open)} className="flex text-left focus:outline-none">
          <div className="max-w-xs flex items-center text-sm rounded-full text-white focus:outline-none focus:shadow-solid">
            <img className="h-8 w-8 rounded-full" src={avatar} alt="" />
          </div>
          <div className="ml-3 -mt-0.5">
            <p className="text-sm leading-5 font-medium text-gray-500 group-hover:text-gray-900">
              {displayName}
            </p>
            <p className="text-xs leading-4 font-medium text-gray-600 group-hover:text-gray-700 group-focus:underline transition ease-in-out duration-150">
              {company || 'Unknown'}
            </p>
          </div>
        </button>
        { open &&
          <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg z-30">
            <div className="py-1 rounded-md bg-white shadow-xs">
              <a href="/settings/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
              <a onClick={onClickLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Sign out</a>
            </div>
          </div>
        }
      </div>
    </div>
  )
}
