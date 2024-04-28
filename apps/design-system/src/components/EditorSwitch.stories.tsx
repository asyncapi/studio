import { StoryObj, Meta } from '@storybook/react'

import { EditorSwitch } from '@asyncapi/studio-ui'

const meta: Meta<typeof EditorSwitch> = {
  component: EditorSwitch,
}

export default meta
type Story = StoryObj<typeof EditorSwitch>
export const CodeEditor: Story = {
  args: {
    isCodeEditor: true,
    onSwitchChange: () => console.log(`onSwitchChange() called.`),
  },
}

export const VisualEditor: Story = {
  args: {
    isCodeEditor: false,
    onSwitchChange: () => console.log(`onSwitchChange() called.`),
  },
}
