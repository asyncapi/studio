import { Logo } from './Logo'
import { Tooltip } from './Tooltip'
import type { FunctionComponent, PropsWithRef, ReactNode } from 'react'

interface NavItem {
  name: string
  title: string
  isActive: boolean
  onClick: () => void
  icon: FunctionComponent<any>,
  tooltip: ReactNode
  align?: 'top' | 'bottom'
}

interface SidebarProps {
  items: NavItem[],
}

interface SidebarButtonProps {
  item: NavItem,
}

const SidebarButton: FunctionComponent<SidebarButtonProps> = ({ item }) => {
  const commonButtonClassNames = 'flex text-sm focus:outline-none border-box p-4 mb-px'

  return (
    <Tooltip content={item.tooltip} placement='right' hideOnClick={true}>
      <button
        onClick={item.onClick}
        className={item.isActive ? `${commonButtonClassNames} text-white` : `${commonButtonClassNames} text-gray-500 hover:text-white focus:text-white`}
        aria-label={item.title}
        type="button"
      >
        <item.icon className="w-6 h-6" />
      </button>
    </Tooltip>
  )
}

export const Sidebar: FunctionComponent<SidebarProps> = ({
  items = []
}) => {
  if (items.length === 0) return null
  
  return (
    <div className="flex flex-col max-w-max h-full bg-gray-900 shadow-lg border-r border-gray-700 justify-between">
      <div>
        <Logo className="w-10 h-10 mt-3 mx-3 mb-4" />
        <div className="flex flex-col items-center">
          {items.filter(item => item.align === 'top' || item.align === undefined).map(item => (
            <SidebarButton item={item} key={item.name} />
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center">
        {items.filter(item => item.align === 'bottom').map(item => (
          <SidebarButton item={item} key={item.name} />
        ))}
      </div>
    </div>
  )
}
