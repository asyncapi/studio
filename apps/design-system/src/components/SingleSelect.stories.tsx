import type { Meta, StoryObj } from "@storybook/react"
/* eslint-disable import/no-anonymous-default-export */
import { SingleSelect, SingleSelectOption } from "@asyncapi/studio-ui"

const meta: Meta<typeof SingleSelect> = {
  component: SingleSelect,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
    },
  },
}
export default meta

const options: SingleSelectOption[] = [
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
type Story = StoryObj<typeof SingleSelect>
export const Default: Story = {
  args: {
    options,
    placeholder: "Select a prptocol...",
    isDisabled: false,
  },
}
