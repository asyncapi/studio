import { StoryObj, Meta } from '@storybook/react'

import { EditorSwitch } from 'ui'

const meta: Meta<typeof EditorSwitch> = {
  component: EditorSwitch,
}

export default meta
type Story = StoryObj<typeof EditorSwitch>
export const CodeEditor: Story = {
  args: {
    isCodeEditor: true,
    onSwitchChange: (value) => console.log(`Switch in Visual Editor mode`),
  },
}

export const VisualEditor: Story = {
  args: {
    isCodeEditor: false,
    onSwitchChange: (value) => console.log(`Switch in Code Editor mode`),
  },
}
