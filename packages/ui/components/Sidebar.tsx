import { Tooltip } from './Tooltip'
import type { FunctionComponent, ReactNode } from 'react'

interface NavItem {
  name: string
  title: string
  isActive: boolean
  onClick: () => void
  icon: ReactNode
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
  const commonButtonClassNames = 'flex text-sm focus:outline-none border-box p-2 m-2'

  return (
    <Tooltip content={item.tooltip} placement='right' hideOnClick={true}>
      <button
        onClick={item.onClick}
        className={item.isActive ? `${commonButtonClassNames} bg-gray-600 rounded text-white` : `${commonButtonClassNames} text-gray-500 hover:text-white`}
        aria-label={item.title}
        type="button"
      >
        {item.icon}
      </button>
    </Tooltip>
  )
}

export const Sidebar: FunctionComponent<SidebarProps> = ({
  items = []
}) => {
  if (items.length === 0) return null
  
  return (
    <div className="flex flex-col max-w-max h-full bg-gray-800 shadow-lg border-r border-gray-700 justify-between">
      <div className="flex flex-col">
        {items.filter(item => item.align === 'top' || item.align === undefined).map(item => (
          <SidebarButton item={item} key={item.name} />
        ))}
      </div>
      <div className="flex flex-col">
        {items.filter(item => item.align === 'bottom').map(item => (
          <SidebarButton item={item} key={item.name} />
        ))}
      </div>
    </div>
  )
}
