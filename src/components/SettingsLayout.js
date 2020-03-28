import AppLayout from '../components/AppLayout'

export default function SettingsLayout ({ children, active, organizations = [], selectedOrg }) {
  const getTitle = () => {
    switch(active) {
      case 'profile':
        return 'Your profile'
      case 'orgs':
        return 'Organizations'
      case 'invitations':
        return 'Invitations'
    }
  }

  const classes = 'mt-1 group flex items-center px-3 py-2 text-sm leading-5 font-medium rounded-md focus:outline-none focus:bg-gray-100 transition ease-in-out duration-150'
  const activeClasses = `${classes} text-gray-900 bg-gray-100 hover:text-gray-900 hover:bg-gray-100`
  const regularClasses = `${classes} mt-1 text-gray-600 hover:text-gray-900 hover:bg-gray-50`

  return (
    <AppLayout
      title={getTitle()}
    >
      <div className="flex">
        <div className="w-64">
          <h2 className="text-black text-3xl mb-4">Settings</h2>
          <nav className="w-64">
            <a href="/settings/profile" className={active === 'profile' ? activeClasses : regularClasses}>
              <span className="truncate">
                Your profile
              </span>
            </a>

            <div className="mt-8">
              <h3 className="px-3 text-xs leading-4 font-semibold text-gray-500 uppercase tracking-wider">
                Organizations
              </h3>
              <div className="mt-1">
                {organizations.map((org, index) => (
                  <a href={`/settings/organizations/${org.id}`} key={index} className={`group flex items-center px-3 py-2 text-sm leading-5 text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:bg-gray-100 transition ease-in-out duration-150 ${selectedOrg == org.id ? 'font-bold' : 'font-normal'}`}>
                    <span className="truncate">
                      {org.name}
                    </span>
                  </a>
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
