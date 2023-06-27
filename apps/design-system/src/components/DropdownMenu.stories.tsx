/* eslint-disable import/no-anonymous-default-export */
import { DropdownMenu } from 'ui'

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
    title: 'Import from URL'
  },
  {
    title: 'Import from file'
  },
  {
    title: 'Import from Base64'
  },
  {
    type: 'separator'
  },
  {
    title: 'Generate code/docs'
  },
]

export const Default = {
  args: {
    trigger: <button className="bg-white text-black rounded mx-3 my-3">Click me!</button>,
    items,
    side: 'bottom',
    align: 'start'
  }
}
