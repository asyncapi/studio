import { useContext } from 'react'
import AppContext from '../../../contexts/AppContext'

export default function OrganizationMenu({ className, orgId, selectedSection = 'basic' }) {
  const { ui } = useContext(AppContext)

  const classNames = 'block truncate px-3 py-1 text-sm leading-5 text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:bg-gray-100 transition ease-in-out duration-150'
  const normalClassNames = `${classNames} font-normal`
  const selectedClassNames = `${classNames} font-bold`

  const sections = ui.settings.organization.navigation

  return (
    <div className={className}>
      {
        sections.map((section, index) => (
          <a key={index} href={`/settings/organizations/${orgId}${section.path}`} className={selectedSection === section.id ? selectedClassNames : normalClassNames}>{section.text}</a>
        ))
      }
    </div>
  )
}

export function getItems() {
  const { ui } = useContext(AppContext)
  return ui.settings.organization.navigation
}
