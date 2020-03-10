import { useState } from 'react'
import ProjectList from './ProjectList'

export default function SaveAPIModal ({
  api,
  onSave = () => {},
  onCancel = () => {},
  projects = [],
}) {
  const [project, setProject] = useState(projects[0].id || null)
  const [title, setTitle] = useState(api.title)

  const updateAPI = () => {
    fetch(`/apis/${api.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(api),
    })
      .then(res => res.json())
      .then(onSave)
      .catch(console.error)
  }

  const onClickSave = () => {
    if (api.anonymous) {
      fetch(`/apis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...api,
          ...{
            project_id: project,
            title,
          }
        }),
      })
        .then(res => res.json())
        .then(onSave)
        .catch(console.error)
    } else {
      updateAPI()
    }
  }

  return (
    <div className="fixed bottom-0 inset-x-0 px-4 pb-6 sm:inset-0 sm:p-0 sm:flex sm:items-center sm:justify-center">
      <div className="fixed inset-0 transition-opacity">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <div className="bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full sm:p-6">
        <div>
          <ProjectList projects={projects} defaultValue={project} onChange={setProject} />
          <div className="mt-2 relative rounded-md shadow-sm">
            <input type="text" name="name" defaultValue={title} autoFocus onInput={e => setTitle(e.target.value)} className="form-input block w-full sm:text-sm sm:leading-5" placeholder="e.g. Product, Customer, ..." required />
          </div>
        </div>
        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
          <span className="flex w-full rounded-md shadow-sm sm:col-start-2">
            <button onClick={onClickSave} type="button" className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-indigo-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition ease-in-out duration-150 sm:text-sm sm:leading-5">
              Save
            </button>
          </span>
          <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:col-start-1">
            <button onClick={onCancel} type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline transition ease-in-out duration-150 sm:text-sm sm:leading-5">
              Cancel
            </button>
          </span>
        </div>
      </div>
    </div>
  )
}
