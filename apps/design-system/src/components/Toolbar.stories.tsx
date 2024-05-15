import { Toolbar } from '@asyncapi/studio-ui'

import { ListBulletIcon, CodeBracketSquareIcon, DocumentTextIcon, EllipsisVerticalIcon } from '@asyncapi/studio-ui/icons'

export default {
  component: Toolbar,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark'
    }
  },
}

const rightItems = [
  {
    type: 'toggleGroupMultiple',
    onValueChange: (newValue: string[]) => console.log(newValue),
    value: ['navigation', 'code editor'],
    items: [
      {
        type: 'toggle',
        title: {
          on: 'Hide navigation',
          off: 'Show navigation',
        },
        icon: ListBulletIcon,
        value: 'navigation',
      },
      {
        type: 'toggle',
        title: {
          on: 'Hide code editor',
          off: 'Show code editor',
        },
        icon: CodeBracketSquareIcon,
        value: 'code editor',
      },
      {
        type: 'toggle',
        title: {
          on: 'Hide documentation',
          off: 'Show documentation',
        },
        icon: DocumentTextIcon,
        value: 'documentation',
      }
    ]
  },
  {
    type: 'separator'
  },
  {
    type: 'dropdownMenu',
    icon: EllipsisVerticalIcon,
    items: [
      {
        title: 'Import from URL',
        onSelect: () => console.log('Import from URL')
      },
      {
        title: 'Import from file',
        onSelect: () => console.log('Import from file')
      },
      {
        title: 'Import from Base64',
        onSelect: () => console.log('Import from Base64')
      },
      {
        type: 'separator'
      },
      {
        title: 'Generate code/docs',
        onSelect: () => console.log('Generate code/docs')
      },
    ]
  }
]

export const WithTitleSubtitleAndRightItems = {
  args: {
    title: 'Streetlights Kafka API',
    subtitle: '(from localStorage)',
    rightItems
  }
}

export const WithoutSubtitle = {
  args: {
    title: 'Streetlights Kafka API',
    rightItems
  }
}

export const WithoutRightItems = {
  args: {
    title: 'Streetlights Kafka API',
    subtitle: '(from localStorage)',
  }
}

export const WithoutSubtitleAndRightItems = {
  args: {
    title: 'Streetlights Kafka API',
  }
}
