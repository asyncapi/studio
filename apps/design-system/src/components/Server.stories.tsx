import { StoryObj, Meta } from '@storybook/react'

import { Server } from '@asyncapi/studio-ui'

const meta: Meta<typeof Server> = {
  component: Server,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark'
    }
  },
}

export default meta
type Story = StoryObj<typeof Server>
export const Default: Story = {
  args: {
    name: 'KAFKA Production',
    icon: 'kafka',
    url: 'my.kafka.broker.com',
  },
}


export const Active: Story = {
  args: {
    ...Default.args,
    isActive: true,
  },
};


export const MissingURL: Story = {
  args: {
    ...Default.args,
    name: 'KAFKA Production',
    icon: 'websocket',
    url: '',
  },
};

export const Faded: Story = {
  args: {
    ...Default.args,
    isFaded: true,
    icon: 'websocket',
    url: '',
  },
};
