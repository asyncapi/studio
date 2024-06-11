import Tooltip from './Tooltip'
import * as RadixToolbar from '@radix-ui/react-toolbar'
import { FunctionComponent } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './DropdownMenu'

interface ToolbarToggleItem {
  type: 'toggle'
  title: {
    on: string
    off: string
  }
  value: string
  icon: FunctionComponent<any>
}

interface ToolbarToggleGroupSingleItem {
  type: 'toggleGroupSingle'
  value: string
  items: ToolbarToggleItem[]
  onValueChange: (value: string) => void
}

interface ToolbarToggleGroupMultipleItem {
  type: 'toggleGroupMultiple'
  value: string[]
  items: ToolbarToggleItem[]
  onValueChange: (value: string[]) => void
}

interface ToolbarSeparatorItem {
  type: 'separator'
}

interface DropdownMenuRegularItem {
  type?: 'regular'
  title: string
  onSelect: () => void
}

interface DropdownMenuSeparatorItem {
  type: 'separator'
}

type DropdownMenuItemInterface = DropdownMenuRegularItem | DropdownMenuSeparatorItem
interface ToolbarDropdownMenuItem {
  type: 'dropdownMenu',
  icon: FunctionComponent<any>
  items: DropdownMenuItemInterface[]
}

type ToolbarItem = ToolbarToggleItem | ToolbarToggleGroupSingleItem | ToolbarToggleGroupMultipleItem | ToolbarSeparatorItem | ToolbarDropdownMenuItem

interface ToolbarProps {
  title: string
  subtitle?: string
  rightItems: ToolbarItem[]
}

interface ToolbarItemProps {
  item: ToolbarItem,
}

interface ToolbarToggleProps {
  item: ToolbarToggleItem,
  selected?: boolean,
}

const ToolbarToggle: FunctionComponent<ToolbarToggleProps> = ({ item, selected = false }) => {
  const commonButtonClassNames = 'flex text-sm focus:outline-none border-box p-2 my-3.5 ml-2.5 bg-gray-800 hover:bg-gray-600 hover:text-white focus:bg-gray-600 focus:text-white rounded'
  const title = selected ? item.title.on : item.title.off
  
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <RadixToolbar.ToggleItem
          value={item.value}
          className={selected ? `${commonButtonClassNames} text-white` : `${commonButtonClassNames} text-gray-500`}
          aria-label={title}
        >
          <item.icon className="w-5 h-5" />
        </RadixToolbar.ToggleItem>
      </Tooltip.Trigger>
      <Tooltip.Content side="bottom">{title}</Tooltip.Content>
    </Tooltip.Root>
  )
}

const ToolbarItem: FunctionComponent<ToolbarItemProps> = ({ item }) => {
  const type = item.type

  if (type === 'toggleGroupSingle') {
    return (
      <RadixToolbar.ToggleGroup
        type="single"
        className="flex"
        defaultValue={item.value}
        onValueChange={item.onValueChange}
        orientation="horizontal"
      >
        {
          item.items.map((groupItem) => (
            <ToolbarToggle key={groupItem.title.on} item={groupItem} selected={item.value.includes(groupItem.value)} />
          ))
        }
      </RadixToolbar.ToggleGroup>
    )
  } else if (type === 'toggleGroupMultiple') {
    return (
      <RadixToolbar.ToggleGroup
        type="multiple"
        className="flex"
        defaultValue={item.value}
        onValueChange={item.onValueChange}
        orientation="horizontal"
      >
        {
          item.items.map((groupItem) => (
            <ToolbarToggle key={groupItem.title.on} item={groupItem} selected={item.value.includes(groupItem.value)} />
          ))
        }
      </RadixToolbar.ToggleGroup>
    )
  } else if (type === 'separator') {
    return (
      <RadixToolbar.Separator
        className="w-px h-8 bg-gray-700 mx-4"
      />
    )
  } else if (type === 'dropdownMenu') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex text-sm focus:outline-none border-box py-2 my-3.5 text-gray-500 hover:text-white focus:text-white rounded">
            <item.icon className="w-6 h-6"/>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {item.items.map((menuItem) => (
            menuItem.type === 'separator' ? <DropdownMenuSeparator key={menuItem.type} /> :
            <DropdownMenuItem key={menuItem.title} onSelect={menuItem.onSelect}>{menuItem.title}</DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  } 
  throw new Error(`Unsupported type of Toolbar item: ${type}`)
}

export const Toolbar: FunctionComponent<ToolbarProps> = ({
  title,
  subtitle,
  rightItems = []
}) => {
  const calculateKey = (item: ToolbarItem ,index: number) => {
    if (item.type === 'separator') return `separator-${index}`
    if (item.type === 'dropdownMenu') return `dropdown-menu-${index}`
    return Array.isArray(item.value) ? item.value.join(',') : item.value
  }

  return (
    <Tooltip.Provider>
      <RadixToolbar.Root orientation="horizontal" className="flex flex-row max-h-max w-full bg-gray-900 shadow-lg border-b border-gray-700 justify-between px-3">
        <div className="flex flex-col py-3 justify-center">
          <span className="text-white text-lg leading-7 font-light">{title}</span>
          { subtitle && (<span className="text-gray-400 text-xs leading-4 font-normal">{subtitle}</span>)}
        </div>
        <div className="flex flex-row items-center">
          {rightItems.map((item, index) => (
            <ToolbarItem item={item} key={calculateKey(item, index)} />
          ))}
        </div>
      </RadixToolbar.Root>
    </Tooltip.Provider>
  )
}
