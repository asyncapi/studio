import { useState, useEffect } from 'react'
import { FaCloudDownloadAlt, FaCaretDown } from 'react-icons/fa'

export default function DownloadAsButton ({ code }) {
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

  const onClickDownload = (template) => {
    const form = document.createElement('form');
    form.setAttribute('method', 'post');
    form.setAttribute('action', `/${template}/download`);
    form.setAttribute('style', 'display: none;');
    const text = document.createElement('textarea');
    text.setAttribute('name', 'data');
    text.value = code;
    form.appendChild(text);
    document.body.appendChild(form);
    form.submit();
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} type="button" className="flex px-3 py-2 text-sm rounded-md text-gray-500 hover:text-white focus:outline-none transition ease-in-out duration-150">
        <FaCloudDownloadAlt className="text-md mt-1 mr-2" />
        Download
        <FaCaretDown className="text-md mt-1 ml-1" />
      </button>
      { open && (
        <div className="origin-top-right absolute right-0 mt-1 mr-3 w-56 rounded-md shadow-lg">
          <div className="rounded-md bg-white shadow-xs">
            <div className="py-1">
              <a onClick={() => onClickDownload('html')} className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 cursor-pointer">Download HTML docs</a>
              <a onClick={() => onClickDownload('markdown')} className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 cursor-pointer">Download Markdown docs</a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
