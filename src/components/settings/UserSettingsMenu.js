import { useContext } from 'react'
import AppContext from '../../contexts/AppContext'

export default function UserSettingsMenu({ className, selectedSection }) {
  const { ui } = useContext(AppContext)

  const classes = 'mt-1 group flex items-center px-3 py-2 text-sm leading-5 font-medium rounded-md focus:outline-none focus:bg-gray-100 transition ease-in-out duration-150'
  const activeClasses = `${classes} text-gray-900 bg-gray-100 hover:text-gray-900 hover:bg-gray-100`
  const regularClasses = `${classes} mt-1 text-gray-600 hover:text-gray-900 hover:bg-gray-50`

  const sections = ui.settings.user.navigation

  return (
    <div className={className}>
      {
        sections.map((section, index) => (
          <a key={index} href={`/settings${section.path}`} className={selectedSection === section.id ? activeClasses : regularClasses}>{section.text}</a>
        ))
      }
    </div>
  )
}

export function getItems() {
  const { ui } = useContext(AppContext)
  return ui.settings.user.navigation
}
