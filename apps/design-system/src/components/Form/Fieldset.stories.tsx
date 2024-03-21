import { Fieldset, ChipInput  } from '@asyncapi/studio-ui'
import type { Meta } from "@storybook/react"
/* eslint-disable import/no-anonymous-default-export */


const meta: Meta<typeof Fieldset> = {
  component: Fieldset,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
    },
  },
}
export default meta

export const Default = () => (
  <Fieldset title="Tags" className='m-4'>
  <div>
    <ChipInput name={''} id={''} chips={["production", "platform"]} onChange={()=> {return}} />
  </div>
</Fieldset>
)
