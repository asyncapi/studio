import { Logo } from './Logo'
import Tooltip from './Tooltip'
import * as Toolbar from '@radix-ui/react-toolbar'
import type { FunctionComponent } from 'react'

interface SidebarItem {
  title: string
  isActive?: boolean
  onClick?: () => void
  icon: FunctionComponent<any>
  align?: 'top' | 'bottom'
}

interface SidebarProps {
  items: SidebarItem[]
}

interface SidebarButtonProps {
  item: SidebarItem
}

const SidebarButton: FunctionComponent<SidebarButtonProps> = ({ item }) => {
  const commonButtonClassNames = 'flex text-sm focus:outline-none border-box p-4 mb-px'

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <Toolbar.Button
          onClick={item.onClick}
          className={item.isActive ? `${commonButtonClassNames} text-white` : `${commonButtonClassNames} text-gray-500 hover:text-white focus:text-white`}
          aria-label={item.title}
        >
          <item.icon className="w-6 h-6" />
        </Toolbar.Button>
      </Tooltip.Trigger>
      <Tooltip.Content>{item.title}</Tooltip.Content>
    </Tooltip.Root>
  )
}

export const Sidebar: FunctionComponent<SidebarProps> = ({
  items = []
}) => {
  if (items.length === 0) return null
  
  return (
    <Tooltip.Provider>
      <Toolbar.Root orientation="vertical" className="flex flex-col max-w-max h-full bg-gray-900 shadow-lg border-r border-gray-700 justify-between">
        <div>
          <Logo className="w-10 h-10 mt-3 mx-3 mb-4" />
          <div className="flex flex-col items-center">
            {items.filter(item => item.align === 'top' || item.align === undefined).map(item => (
              <SidebarButton item={item} key={item.title} />
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center">
          {items.filter(item => item.align === 'bottom').map(item => (
            <SidebarButton item={item} key={item.title} />
          ))}
        </div>
      </Toolbar.Root>
    </Tooltip.Provider>
  )
}
