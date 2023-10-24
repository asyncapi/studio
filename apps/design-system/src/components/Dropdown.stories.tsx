import { Dropdown, DropdownOption } from '@asyncapi/studio-ui'
import type { Meta, StoryObj } from "@storybook/react"
/* eslint-disable import/no-anonymous-default-export */


const meta: Meta<typeof Dropdown> = {
  component: Dropdown,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "light",
    },
  },
}
export default meta

const options: DropdownOption[] = [
  {
    type: "group",
    label: "MQTT",
    options: [
      {
        label: "MQTT 3",
        value: "mqtt3",
      },
      {
        label: "MQTT 5",
        value: "mqtt5",
      },
    ],
  },
  {
    type: "separator",
  },
  {
    label: "MQTT",
    value: "mqtt",
  },
  {
    label: "AMQP 0-9-1",
    value: "amqp0",
  },
  {
    label: "AMQP 1",
    value: "amqp1",
  },
  {
    label: "KAFKA",
    value: "kafka",
  },
  {
    label: "HTTP",
    value: "http",
  },
  {
    label: "Socket.io",
    value: "socket.io",
  },
]
type Story = StoryObj<typeof Dropdown>
export const Default: Story = {
  args: {
    options,
    placeholder: "Select a prptocol...",
    isDisabled: false,
  },
}
