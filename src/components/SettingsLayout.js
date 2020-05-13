import AppLayout from '../components/AppLayout'
import { default as UserSettingsMenu, getItems as getUserMenuItems } from './settings/UserSettingsMenu'
import { default as OrganizationMenu, getItems as getOrganizationMenuItems } from './settings/organizations/OrganizationMenu'

export default function SettingsLayout ({ children, activeSection, organizations = [], selectedOrg, selectedOrgSection = 'basic', plan = {} }) {
  const org = organizations.find(o => o.id === Number(selectedOrg))

  const getTitle = () => {
    if (activeSection === 'orgs') {
      const item = getOrganizationMenuItems().find(i => i.id === selectedOrgSection)
      return item ? `Settings > ${org ? org.name : 'Organizations'} > ${item.text}` : 'Organizations'
    }

    const item = getUserMenuItems().find(i => i.id === activeSection)
    return item ? `Settings > ${item.text}` : 'Settings'
  }

  return (
    <AppLayout
      title={getTitle()}
    >
      <div className="flex">
        <div className="w-64">
          <h2 className="text-black text-3xl mb-4">Settings</h2>
          <nav className="w-64">
            <UserSettingsMenu
              selectedSection={activeSection}
            />

            <div className="mt-8">
              <h3 className="px-3 text-xs leading-4 font-semibold text-gray-500 uppercase tracking-wider">
                Organizations
              </h3>
              <div className="mt-1">
                {organizations.map((org, index) => (
                  <div key={index}>
                    <a href={`/settings/organizations/${org.id}`} className={`group flex items-center px-3 py-2 text-sm leading-5 text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:bg-gray-100 transition ease-in-out duration-150 ${selectedOrg == org.id ? 'font-medium' : 'font-normal'}`}>
                      <span className="truncate">{org.name}</span>
                    </a>
                    { selectedOrg == org.id && (
                      <OrganizationMenu
                        className="pl-4"
                        orgId={org.id}
                        selectedSection={selectedOrgSection}
                      />
                    ) }
                  </div>
                ))}
              </div>
            </div>
          </nav>
        </div>

        <div className="flex-1 pl-8">
          {children}
        </div>
      </div>
    </AppLayout>
  )
}
