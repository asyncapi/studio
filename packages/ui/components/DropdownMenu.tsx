import type { FunctionComponent, ReactNode } from 'react'
import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu'

interface DropdownMenuRegularItem {
  type?: 'regular'
  title: string
  onSelect: () => {}
}

interface DropdownMenuSeparatorItem {
  type: 'separator'
}

export type DropdownMenuItem = DropdownMenuRegularItem | DropdownMenuSeparatorItem

interface DropdownMenuProps {
  trigger: ReactNode
  items: DropdownMenuItem[]
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
}

interface DropdownMenuItemComponentProps {
  item: DropdownMenuItem
}

const DropdownMenuItemComponent: FunctionComponent<DropdownMenuItemComponentProps> = ({ item }) => {
  return item.type === 'separator' ? (
    <RadixDropdownMenu.Separator className='w-full h-px bg-gray-700 my-2' />
  ) : (
    <RadixDropdownMenu.Item
      className='text-gray-200 text-sm leading-7 px-2.5 cursor-pointer rounded outline-none select-none hover:bg-gray-700 focus:bg-gray-700'
      onSelect={item.onSelect}
    >
      {item.title}
    </RadixDropdownMenu.Item>
  )
}

export const DropdownMenu: FunctionComponent<DropdownMenuProps> = ({ trigger, items, side, align }) => {
  return (
    <RadixDropdownMenu.Root>
      <RadixDropdownMenu.Trigger asChild>{trigger}</RadixDropdownMenu.Trigger>
      <RadixDropdownMenu.Portal>
        <RadixDropdownMenu.Content
          className='min-w-[220px] bg-gray-950 rounded-md p-2.5 shadow'
          sideOffset={5}
          side={side}
          align={align}
        >
          {items.map((item) => (
            <DropdownMenuItemComponent item={item} />
          ))}
          <RadixDropdownMenu.Arrow className='fill-gray-950' />
        </RadixDropdownMenu.Content>
      </RadixDropdownMenu.Portal>
    </RadixDropdownMenu.Root>
  )
}
