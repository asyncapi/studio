/* eslint-disable import/no-anonymous-default-export */
import { DropdownMenu } from '@asyncapi/studio-ui'

export default {
  component: DropdownMenu,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark'
    }
  },
}

const items = [
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

export const Default = {
  args: {
    trigger: <button className="text-black bg-white rounded mx-3 my-3 px-3">Click me!</button>,
    items,
    side: 'bottom',
    align: 'start'
  }
}
