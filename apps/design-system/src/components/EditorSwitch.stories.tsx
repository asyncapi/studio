import { Meta, StoryObj } from '@storybook/react'

import { EditorSwitch } from 'ui'

const meta: Meta<typeof EditorSwitch> = {
  component: EditorSwitch,
}

export default meta
type Story = StoryObj<typeof EditorSwitch>

export const Default: Story = {
  args: {},
}
