import { FaBuilding } from 'react-icons/fa'
import Dropdown from './Dropdown'

export default function FilterOrganizationsButton ({ orgs = [], selected }) {
  const title = selected && selected.name ? selected.name : 'Select organization'

  return (
    <Dropdown title={title} icon={<FaBuilding className="text-md mt-1 mr-2" />}>
      <a href="?" className="block px-4 py-2 text-sm leading-5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 cursor-pointer">Select organization</a>

      { orgs.map(org => (
        <a href={`?org=${org.id}`} key={org.id} className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 cursor-pointer">{org.name}</a>
      )) }
    </Dropdown>
  )
}
