import { StoryObj, Meta } from '@storybook/react'

import { TextInput } from '@asyncapi/studio-ui'

const meta: Meta<typeof TextInput> = {
  component: TextInput,
}

export default meta
type Story = StoryObj<typeof TextInput>

export const Default: Story = {
  args: {
    placeholder: "Enter some text....",
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
}


export const WithInitialValue: Story = {
  args: {
    ...Default.args,
    value: 'Initial Value',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const Numeric: Story = {
  args: {
    ...Default.args,
    type: 'number',
    placeholder: 'Enter some numbers...',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};


export const Email: Story = {
  args: {
    ...Default.args,
    type: 'email',
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


export const WithCustomClassName: Story = {
  args: {
    ...Default.args,
    className: 'w-full',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};
