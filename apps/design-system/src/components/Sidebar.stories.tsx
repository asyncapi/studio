/* eslint-disable import/no-anonymous-default-export */
import { Sidebar } from '@asyncapi/studio-ui'

import { ServerStackIcon, MapIcon, SquaresPlusIcon, ScaleIcon, UsersIcon, AdjustmentsHorizontalIcon, PlusIcon, MagnifyingGlassIcon } from '@asyncapi/studio-ui/icons'

export default {
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark'
    }
  },
}

const topItems = [
  {
    title: 'Services',
    isActive: true,
    onClick: () => alert('Services'),
    icon: ServerStackIcon,
  },
  {
    title: 'Topology',
    isActive: false,
    onClick: () => alert('Topology'),
    icon: MapIcon,
  },
  {
    title: 'Registry',
    isActive: false,
    onClick: () => alert('Registry'),
    icon: SquaresPlusIcon,
  },
  {
    title: 'Governance',
    isActive: false,
    onClick: () => alert('Governance'),
    icon: ScaleIcon,
  },
  {
    title: 'Users',
    isActive: false,
    onClick: () => alert('Users'),
    icon: UsersIcon,
  },
  {
    title: 'Organization Settings',
    isActive: false,
    onClick: () => alert('Organization Settings'),
    icon: AdjustmentsHorizontalIcon,
  }
]

const bottomItems = [
  {
    title: 'Create new...',
    isActive: false,
    onClick: () => alert('Create new...'),
    icon: PlusIcon,
    align: 'bottom'
  },
  {
    title: 'Search',
    isActive: false,
    onClick: () => alert('Search'),
    icon: MagnifyingGlassIcon,
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
