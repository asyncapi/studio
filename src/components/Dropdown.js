import { useState, useEffect } from 'react'
import { FaCaretDown } from 'react-icons/fa'

export default function Dropdown ({ title = 'Select', icon, showCaret = true, className = 'relative', buttonHoverClassName, align = 'right', children }) {
  const [open, setOpen] = useState(false)

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

  buttonHoverClassName = buttonHoverClassName || 'hover:text-white'

  return (
    <div className={className}>
      <button onClick={() => setOpen(!open)} type="button" className={`flex px-3 py-2 text-sm rounded-md ${buttonHoverClassName} focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition ease-in-out duration-150`}>
        { icon }
        { title }
        { showCaret && <FaCaretDown className="text-md mt-1 ml-1" /> }
      </button>
      { open && (
        <div className={`origin-top-right absolute ${align === 'right' && 'right-0'} ${align === 'left' && 'left-0'} mt-1 mr-3 w-64 rounded-md shadow-lg z-50`}>
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
