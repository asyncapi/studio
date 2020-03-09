import { useContext, useEffect, useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import AppContext from '../contexts/AppContext'

export default function UserMenu () {
  const [open, setOpen] = useState(false)
  const { user } = useContext(AppContext)

  if (!user) {
    return (
      <a href="/auth/github" className="inline-flex self-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
        <FaGithub className="text-xl mr-2" />
        Sign in using Github
      </a>
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
    <div className="hidden md:block">
      <div className="ml-4 flex items-center md:ml-6">
        <div className="ml-3 relative">
          <button onClick={() => setOpen(!open)} className="flex text-left">
            <div className="max-w-xs flex items-center text-sm rounded-full text-white focus:outline-none focus:shadow-solid">
              <img className="h-8 w-8 rounded-full" src={avatar} alt="" />
            </div>
            <div className="ml-3">
              <p className="text-sm leading-5 font-medium text-gray-500 group-hover:text-gray-900">
                {displayName}
              </p>
              <p className="text-xs leading-4 font-medium text-gray-600 group-hover:text-gray-700 group-focus:underline transition ease-in-out duration-150">
                {company}
              </p>
            </div>
          </button>
          { open &&
            <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg z-30">
              <div className="py-1 rounded-md bg-white shadow-xs">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                <a onClick={onClickLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Sign out</a>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}
