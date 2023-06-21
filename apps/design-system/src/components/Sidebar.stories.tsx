/* eslint-disable import/no-anonymous-default-export */
import { Sidebar } from 'ui'

import { ServerStackIcon, MapIcon, SquaresPlusIcon, ScaleIcon, UsersIcon, AdjustmentsHorizontalIcon, PlusIcon, MagnifyingGlassIcon } from 'ui/icons'

export default {
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
}

const topItems = [
  {
    name: 'primarySidebar',
    title: 'Navigation',
    isActive: true,
    onClick: () => {},
    icon: ServerStackIcon,
    tooltip: 'Navigation',
  },
  {
    name: 'primaryPanel',
    title: 'Editor',
    isActive: false,
    onClick: () => {},
    icon: MapIcon,
    tooltip: 'Editor',
  },
  {
    name: 'template',
    title: 'Template',
    isActive: false,
    onClick: () => {},
    icon: SquaresPlusIcon,
    tooltip: 'HTML preview',
  },
  {
    name: 'visualiser',
    title: 'Visualiser',
    isActive: false,
    onClick: () => {},
    icon: ScaleIcon,
    tooltip: 'Blocks visualiser',
  },
  {
    name: 'newFile',
    title: 'New file',
    isActive: false,
    onClick: () => {},
    icon: UsersIcon,
    tooltip: 'New file',
  },
  {
    name: 'newFile',
    title: 'New file',
    isActive: false,
    onClick: () => {},
    icon: AdjustmentsHorizontalIcon,
    tooltip: 'New file',
  }
]

const bottomItems = [
  {
    name: 'settings',
    title: 'Settings',
    isActive: false,
    onClick: () => {},
    icon: PlusIcon,
    tooltip: 'Settings',
    align: 'bottom'
  },
  {
    name: 'settings',
    title: 'Settings',
    isActive: false,
    onClick: () => {},
    icon: MagnifyingGlassIcon,
    tooltip: 'Settings',
    align: 'bottom'
  }
]

export const WithTopAndBottomItems = {
  args: {
    items: [
      ...topItems,
      ...bottomItems,
    ]
  }
};

export const WithTopItemsOnly = {
  args: {
    items: topItems
  }
};

export const WithBottomItemsOnly = {
  args: {
    items: bottomItems
  }
};

export const NoItems = {
  args: {
    items: [],
  }
};
