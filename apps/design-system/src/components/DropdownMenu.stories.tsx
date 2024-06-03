import React from 'react';
import { Meta } from '@storybook/react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator } from '@asyncapi/studio-ui'

const meta: Meta = {
  component: DropdownMenu,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark'
    }
  }
}

export default meta


export const Default = {
  render: () => (<DropdownMenu>
    <DropdownMenuTrigger asChild>
    <button className="text-black bg-white rounded mx-3 my-3 px-3">Click me!</button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem onSelect={(e) => console.log(e.target)}>Import from URL</DropdownMenuItem>
      <DropdownMenuItem onSelect={(e) => console.log(e.target)}>Import from file</DropdownMenuItem>
      <DropdownMenuItem onSelect={(e) => console.log(e.target)}>Import from Base64</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onSelect={(e) => console.log(e.target)}>Generate code/docs</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>)
}
