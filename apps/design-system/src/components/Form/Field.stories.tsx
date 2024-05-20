import { Field, Form, TextInput  } from '@asyncapi/studio-ui'
import type { Meta } from "@storybook/react"
/* eslint-disable import/no-anonymous-default-export */


const meta: Meta<typeof Field> = {
  component: Field,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
    },
  },
}
export default meta

export const Default = () => (
  <Form>
    <Field className="grow" label="Schema Registry Vendor" name="vendor">
      <TextInput value="Confluent" placeholder="" />
    </Field>
  </Form>
)

export const NoLabel = () => (
  <Form>
    <Field className="grow" name={"vendor"}>
      <TextInput value="Confluent" placeholder="Enter vendor..." />
    </Field>
  </Form>
);
export const WithTooltip = () => (
  <Form>
    <Field className="grow" label="Schema Registry Vendor" name={"vendor"} tooltip="This is a vendor tooltip">
      <TextInput value="Confluent" placeholder="" />
    </Field>
  </Form>
);
