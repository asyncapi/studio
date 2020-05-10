import { useContext } from 'react'
import { FaPlus } from 'react-icons/fa'
import Dropdown from './Dropdown'
import AppContext from '../contexts/AppContext'

export default function CreateButton ({ showTitle = true }) {
  const { user } = useContext(AppContext)

  let canCreateOrg = false

  if (user) {
    const plan = user.plan || {}
    const restrictions = plan.restrictions || {}
    const maxOrgCount = restrictions['organizations.maxCount']
    const userOrgCount = Array.isArray(user.organizationsForUser) ? user.organizationsForUser.length : 0
    canCreateOrg = typeof maxOrgCount === 'number' && userOrgCount < maxOrgCount
  }

  return (
    <Dropdown title={showTitle && 'Add'} icon={<FaPlus className="text-md mt-1 mr-2" />}>
      <a href="/apis/new" className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 cursor-pointer">New AsyncAPI file</a>
      <a href="/projects/new" className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 cursor-pointer">New project</a>
      {
        canCreateOrg ? (
          <a href="/organizations/new" className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 cursor-pointer">New organization</a>
        ) : (
          <a href="/upgrade" className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 cursor-pointer">
            New organization
            <span className="bg-indigo-600 text-white text-xs rounded ml-4 px-2 py-1">Upgrade &nbsp;🚀</span>
          </a>
        )
      }
    </Dropdown>
  )
}
