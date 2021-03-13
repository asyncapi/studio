import { useContext } from 'react'
import AppContext from '../contexts/AppContext'
import UserMenu from './UserMenu'
import CreateButton from './CreateButton'

export default function Topbar ({ active }) {
  const { ui } = useContext(AppContext)

  const classes = 'px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:text-white focus:bg-gray-700 mr-4'
  const activeClasses = `${classes} text-white bg-gray-900`
  const regularClasses = `${classes} text-gray-300 hover:text-white hover:bg-gray-700`

  const menuItems = [{ href: '/', key: 'editor', title: 'Editor' }]

  if (ui.enableAuth) {
    menuItems.push({ href: '/directory', title: 'Directory' })
  }

  return (
    <nav className="bg-gray-800 z-30">
      <div className="sm:px-6 lg:px-8 border-b border-gray-700">
        <div className="flex items-center justify-between h-16 px-4 sm:px-0">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img className="inline-block h-20" src="/img/logo-horizontal-white.svg" alt="" />
              <span className="inline-block text-xl text-pink-500 font-normal italic tracking-wide -ml-1 transform translate-y-0.5">studio</span>
            </div>
            <div>
              {
                menuItems.length > 1 && (
                  <div className="ml-10 flex items-baseline">
                    {
                      menuItems.map(({key, href, title}) => (
                        <a key={key} href={href} className={active === key ? activeClasses : regularClasses}>{title}</a>
                      ))
                    }
                  </div>
                )
              }
            </div>
          </div>
          <div className="flex text-gray-500">
            {
              ui.enableAuth && (
                <>
                  <CreateButton showTitle={false} />
                  <UserMenu />
                </>
              )
            }
          </div>
        </div>
      </div>
    </nav>
  )
}
