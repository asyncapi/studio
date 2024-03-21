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

export const Resizable: Story = {
  args: {
    ...Default.args,
    isResizable: true,
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};


export const Disabled: Story = {
  args: {
    ...Default.args,
    isDisabled: true,
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const RowsLimit: Story = {
  args: {
    ...Default.args,
    rows: 3,
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

