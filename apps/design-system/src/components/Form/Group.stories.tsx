import { Dropdown, Group, TextInput } from '@asyncapi/studio-ui'
import { TrashIcon } from '@asyncapi/studio-ui/icons'

import type { Meta } from "@storybook/react"
/* eslint-disable import/no-anonymous-default-export */


const meta: Meta<typeof Group> = {
  component: Group,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
    },
  },
}
export default meta



export const Default = () => (
<Group className='m-3'>
  <div className="flex flex-col gap-3">
    <div className="flex gap-3">
      <Dropdown options={[{ label: "User/Password", value: "user/password" }]} value="user/password" />
      <TextInput placeholder="Type something here..." className="grow" />
      <TrashIcon className="w-6 h-6 text-gray-500" />
    </div>
    <TextInput placeholder="Type something here..." />
  </div>
</Group>
)
