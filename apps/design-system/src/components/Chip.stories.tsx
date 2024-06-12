import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Chip } from '@asyncapi/studio-ui'; 


const meta: Meta<typeof Chip> = {
  component: Chip,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
    },
  },
  args: {
    onDelete: fn()
  }
}
export default meta;


type Story = StoryObj<typeof Chip>


export const Default: Story = {
  args: {
    chip: 'Chip',
  },
}
