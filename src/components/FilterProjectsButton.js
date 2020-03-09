import { useContext } from 'react'
import { FaFolder } from 'react-icons/fa'
import 'url-search-params-polyfill'
import Dropdown from './Dropdown'
import AppContext from '../contexts/AppContext'

export default function FilterProjectsButton({ projects = [], selected }) {
  const { url } = useContext(AppContext)
  const title = selected && selected.name ? selected.name : 'Select project'

  const queryParamsFor = (obj) => new URLSearchParams({ ...url.query, ...obj }).toString()

  const renderProjects = () => {
    if (!projects.length) {
      return (
        <span className="block px-4 py-2 text-sm leading-5 text-gray-400 italic cursor-default">There are no projects yet</span>
      )
    }

    return projects.map(project => (
      <a href={`?${queryParamsFor({ project: project.id })}`} key={project.id} className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 cursor-pointer">{project.name}</a>
    ))
  }

  return (
    <Dropdown title={title} icon={<FaFolder className="text-md mt-1 mr-2" />}>
      {renderProjects()}
    </Dropdown>
  )
}
