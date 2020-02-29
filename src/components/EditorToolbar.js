import { useState } from 'react'
import { FaFileImport, FaTimes, FaSave } from 'react-icons/fa'
import DownloadAsButton from './DownloadAsButton'

export default function EditorToolbar ({
  fileUrl = 'Untitled document',
  onImport = () => {},
  code,
  saved = false,
}) {
  const [importing, setImporting] = useState(false)
  const [importUrl, setImportUrl] = useState('')
  const [importError, setImportError] = useState()

  const onImportFormSubmit = (e) => {
    e.preventDefault()
    fetch(importUrl)
      .then(function (response) {
        if (!response.ok) {
          setImportError(response.statusText)
          return
        }
        return response.text()
      })
      .then(function (content) {
        onImport({ url: importUrl, content })
        setImporting(false)
      })
      .catch(function (err) {
        setImportError(err.message)
      })
  }

  const onImportInput = (e) => {
    setImportUrl(e.target.value)
    setImportError()
  }

  const onClickSave = (e) => {

  }

  return (
    <div style={{ height: '60px' }} className="flex flex-col bg-gray-800 shadow-md px-4 py-3 z-20">
      <nav className="flex flex-row content-end flex-wrap">
        { !importing ? (
          <>
            <div className="flex flex-1 truncate">
              <div className="text-sm text-gray-600 italic mt-2 pr-1 truncate" title={fileUrl}>{fileUrl}</div>
              {!saved && <span className="bg-orange-700 text-white text-xs rounded-md block w-2 h-2 mt-3 ml-2 mr-3" title="Not saved" />}
            </div>
            <div className="flex">
              <span className="block rounded-md shadow-sm">
                <a onClick={onClickSave} href="/login" className="flex px-2 py-2 text-sm rounded-md text-gray-500 hover:text-white focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150" title="Save">
                  <FaSave className="text-md mt-1 mr-2" />
                  Save
                </a>
              </span>
              <span className="block rounded-md shadow-sm">
                <button onClick={() => { setImporting(true); setImportError(); }} type="button" className="flex px-2 py-2 text-sm rounded-md text-gray-500 hover:text-white focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150" title="Import AsyncAPI document">
                  <FaFileImport className="text-md mt-1 mr-2" />
                  Import
                </button>
              </span>
              <DownloadAsButton code={code} />
            </div>
          </>
        ) : (
          <form className="flex flex-1" onSubmit={onImportFormSubmit}>
            <input
              type="url"
              required
              autoFocus
              onKeyUp={e => (e.keyCode === 27 && setImporting(false)) }
              onInput={onImportInput}
              className="block flex-1 px-4 py-1 rounded-md text-sm leading-5 text-gray-700 bg-white hover:text-gray-900 focus:outline-none focus:text-gray-900" placeholder="Type the URL of the AsyncAPI document to import..."
            />
            <span className="block rounded-md shadow-sm ml-3">
              <button type="submit" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-500 hover:text-white focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150">
                Import
                <FaFileImport className="ml-3" />
              </button>
            </span>
            <span className="block rounded-md shadow-sm">
              <button onClick={() => setImporting(false)} type="button" className="px-2 py-2 text-lg font-medium rounded-md text-gray-500 hover:text-white focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150" title="Import AsyncAPI document">
                <FaTimes />
              </button>
            </span>
          </form>
        )}
      </nav>
      {importing && importError && (
        <div className="flex-1 text-red-500 pt-2">
          {importError}
        </div>
      )}
    </div>
  )
}
