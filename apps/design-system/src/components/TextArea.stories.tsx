import { StoryObj, Meta } from '@storybook/react'

import { TextArea } from '@asyncapi/studio-ui'

const meta: Meta<typeof TextArea> = {
  component: TextArea,

}

export default meta
type Story = StoryObj<typeof TextArea>

export const Default: Story = {
  args: {
    onChange: () => {console.log('content changed.')},
    rows: 5,
    name: "description",
    isResizable: false,
    placeholder: "Describe something...",
    isDisabled: false
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
}
