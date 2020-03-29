import UserMenu from './UserMenu'
import CreateButton from './CreateButton'

export default function Topbar ({ active }) {
  const classes = 'px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:text-white focus:bg-gray-700 mr-4'
  const activeClasses = `${classes} text-white bg-gray-900`
  const regularClasses = `${classes} text-gray-300 hover:text-white hover:bg-gray-700`

  return (
    <nav className="bg-gray-800 z-30">
      <div className="sm:px-6 lg:px-8 border-b border-gray-700">
        <div className="flex items-center justify-between h-16 px-4 sm:px-0">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img className="inline-flex h-20" src="/img/logo-horizontal-white.svg" alt="" />
            </div>
            <div>
              <div className="ml-10 flex items-baseline">
                <a href="/" className={active === 'editor' ? activeClasses : regularClasses}>Editor</a>
                <a href="/directory" className={active === 'directory' ? activeClasses : regularClasses}>Directory</a>
              </div>
            </div>
          </div>
          <div className="flex text-gray-500">
            <CreateButton showTitle={false} />
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  )
}
