import { useState, useEffect } from 'react'
import { FaCaretDown } from 'react-icons/fa'

export default function Dropdown ({ title = 'Select', icon, showCaret = true, children }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) registerClickAway()
  }, [open])

  const registerClickAway = () => {
    document.removeEventListener("click", unregisterClickAway);
    document.addEventListener("click", unregisterClickAway);

    document.querySelectorAll('iframe').forEach(iframe => {
      iframe.contentWindow.document.removeEventListener("click", unregisterClickAway);
      iframe.contentWindow.document.addEventListener("click", unregisterClickAway);
    })
  }

  const unregisterClickAway = () => {
    setOpen(false)
    document.removeEventListener("click", unregisterClickAway);
    document.querySelectorAll('iframe').forEach(iframe => {
      iframe.contentWindow.document.removeEventListener("click", unregisterClickAway);
    })
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} type="button" className="flex px-3 py-2 text-sm rounded-md text-gray-500 hover:text-white focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition ease-in-out duration-150">
        { icon }
        { title }
        { showCaret && <FaCaretDown className="text-md mt-1 ml-1" /> }
      </button>
      { open && (
        <div className="origin-top-right absolute right-0 mt-1 mr-3 w-56 rounded-md shadow-lg">
          <div className="rounded-md bg-white shadow-xs">
            <div className="py-1">
              { children }
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
