import { FaPlus } from 'react-icons/fa'
import Dropdown from './Dropdown'

export default function CreateButton () {
  return (
    <Dropdown title="Add" icon={<FaPlus className="text-md mt-1 mr-2" />}>
      <a href="/apis/new" className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 cursor-pointer">New AsyncAPI file</a>
      <a href="/projects/new" className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 cursor-pointer">New project</a>
      <a href="/organizations/new" className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 cursor-pointer">New organization</a>
    </Dropdown>
  )
}
