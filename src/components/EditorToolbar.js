import { useState, useContext } from 'react'
import { FaFileImport, FaTimes, FaSave, FaEllipsisV } from 'react-icons/fa'
import DownloadAsButton from './DownloadAsButton'
import SaveAPIModal from './SaveAPIModal'
import DeleteAPIModal from './DeleteAPIModal'
import Dropdown from './Dropdown'
import AppContext from '../contexts/AppContext'
import apiCall from './helpers/api-call'

export default function EditorToolbar ({
  onImport = () => {},
  onSave = () => {},
  code,
  saved = false,
  api,
  projects = [],
}) {
  const [importing, setImporting] = useState(false)
  const [importUrl, setImportUrl] = useState('')
  const [importError, setImportError] = useState()
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showDeleteAPIModal, setShowDeleteAPIModal] = useState(false)
  const { user: loggedInUser } = useContext(AppContext)

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

  const saveAPI = () => {
    apiCall(`/apis/${api.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        ...api,
        ...{
          asyncapi: code,
        }
      }),
    }).then(onSave)
  }

  const onClickSave = async (e) => {
    if (!loggedInUser) {
      window.location.href = '/auth/signin'
      return
    }

    if (!api.anonymous) {
      saveAPI()
    } else {
      setShowSaveModal(true)
    }
  }

  const onSaveAnonymous = (savedAPI) => {
    setShowSaveModal(false)
    window.location.href = `/apis/${savedAPI.id}`
  }

  const onClickDeleteAPI = () => {
    setShowDeleteAPIModal(true)
  }

  const onDeleteAPI = () => {
    setShowDeleteAPIModal(false)
    window.location.href = '/'
  }

  const renderFileName = () => {
    if (api.anonymous) {
      return (
        <div className="text-sm text-gray-400 italic mt-2 pr-1 truncate" title={api.title}>{api.title}{api.fromLocalStorage && ' (from local storage)'}</div>
      )
    }

    const classes = `text-sm text-gray-400 mt-2 pr-1 truncate ${!saved && 'italic'}`

    return (
      <>
        <a href="/" className="mt-1 px-2 py-2 text-sm font-medium rounded-md text-gray-500 hover:text-white focus:outline-none transition ease-in-out duration-150" title="Stop editing this file">
          <FaTimes className="text-md text-gray-400" />
        </a>
        <div className={classes} title={api.org_name}>{api.org_name}</div>
        <div className={classes}>/</div>
        <div className={classes} title={api.project_name}>{api.project_name}</div>
        <div className={classes}>/</div>
        <div className={classes} title={api.title}>{api.title}</div>
      </>
    )
  }

  return (
    <div style={{ height: '60px' }} className="flex flex-col bg-gray-800 shadow-md px-4 py-3 z-20">
      { showSaveModal &&
        <SaveAPIModal
          api={{
            ...api,
            ...{
              asyncapi: code,
            }
          }}
          projects={projects}
          onCancel={() => { setShowSaveModal(false) }}
          onSave={onSaveAnonymous}
        />
      }
      {showDeleteAPIModal &&
        <DeleteAPIModal
          api={{
            ...api,
            ...{
              asyncapi: code,
            }
          }}
          onCancel={() => { setShowDeleteAPIModal(false) }}
          onDelete={onDeleteAPI}
        />
      }
      <nav className="flex flex-row">
        { !importing ? (
          <>
            <div className="flex flex-1 truncate">
              {renderFileName()}
              {!saved && <span className="bg-orange-700 text-white text-xs rounded-md block w-2 h-2 mt-3 ml-2 mr-3" title="Not saved" />}
            </div>
            <div className="flex text-gray-500">
              <span className="block rounded-md shadow-sm">
                <button onClick={onClickSave} className="flex px-2 py-2 text-sm rounded-md text-gray-500 hover:text-white focus:outline-none transition ease-in-out duration-150" title="Save">
                  <FaSave className="text-md mt-1 mr-2" />
                  Save
                </button>
              </span>
              <span className="block rounded-md shadow-sm">
                <button onClick={() => { setImporting(true); setImportError(); }} type="button" className="flex px-2 py-2 text-sm rounded-md text-gray-500 hover:text-white focus:outline-none transition ease-in-out duration-150" title="Import AsyncAPI document">
                  <FaFileImport className="text-md mt-1 mr-2" />
                  Import
                </button>
              </span>
              <DownloadAsButton code={code} />
              { !api.anonymous && (
                  <Dropdown title="" showCaret={false} icon={<FaEllipsisV className="text-md mt-1 mr-2" />}>
                    <a onClick={onClickDeleteAPI} className="block px-4 py-2 text-sm leading-5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 cursor-pointer">Delete API</a>
                  </Dropdown>
                )
              }
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
              <button type="submit" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-500 hover:text-white focus:outline-none transition ease-in-out duration-150">
                Import
                <FaFileImport className="ml-3" />
              </button>
            </span>
            <span className="block rounded-md shadow-sm">
              <button onClick={() => setImporting(false)} type="button" className="px-2 py-2 text-lg font-medium rounded-md text-gray-500 hover:text-white focus:outline-none transition ease-in-out duration-150" title="Import AsyncAPI document">
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
