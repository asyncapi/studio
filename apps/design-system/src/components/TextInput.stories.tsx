import type { Meta, StoryObj } from "@storybook/react"
/* eslint-disable import/no-anonymous-default-export */
import { TextInput } from "@asyncapi/studio-ui"

const meta: Meta<typeof TextInput> = {
  component: TextInput,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
    },
  },
}
export default meta

type Story = StoryObj<typeof TextInput>
export const Default: Story = {
  args: {
    isDisabled: false,
    placeholder: "Enter some text...",
    type: "url",
  },
}
