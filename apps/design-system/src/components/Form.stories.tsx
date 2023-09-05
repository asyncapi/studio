import type { Meta } from "@storybook/react"
import {
  DescriptionWithLabel,
  Field,
  Form,
  FormGroup,
  FormSection,
  IconButton,
  Input,
  Label,
  SelectDropdown,
} from "@asyncapi/studio-ui"
import { AddIcon, TrashIcon } from "@asyncapi/studio-ui/icons"

const meta: Meta<typeof Form> = {
  component: Form,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#0F172A" }],
    },
  },
}

export default meta

const singleSelectOptions = [
  { label: "HTTP", value: "http" },
  { label: "Kafka", value: "kafka" },
  { label: "Websocket", value: "websocket" },
  { label: "AMQP", value: "amqp" },
  { label: "MQTT", value: "mqtt" },
  { label: "Google PubSub", value: "googlepubsub" },
  { label: "IBM MQ", value: "ibmmq" },
  { label: "NATS", value: "nats" },
  { label: "Pulsar", value: "pulsar" },
]
export const Default = () => (
  <Form
    title="User Registration"
    summary="Type a short summary description..."
    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu condimentum mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu condimentum mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu condimentum mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu condimentum mauris.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu condimentum mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu condimentum mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu condimentum mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu condimentum mauris"
  >
    <FormSection title="Connection Details">
      <div className="flex gap-3">
        <Field name="protocol" label="Protocol">
          <SelectDropdown options={singleSelectOptions} placeholder="Select a protocol..." />
        </Field>
        <Field name="Email" label="email" className="grow">
          <Input placeholder="Enter your email" />
        </Field>
      </div>
      <div className="flex gap-3">
        <Field className="grow" label="Schema Registry URL" name={"schema"}>
          <Input value="https://registry.mycompay.com" placeholder="" />
        </Field>
        <Field className="grow" label="Schema Registry Vendor" name={"vendor"}>
          <Input value="Confluent" placeholder="" />
        </Field>
      </div>
      <Label label={"Security"} />
      <FormGroup>
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <SelectDropdown options={[{ label: "User/Password", value: "user/password" }]} value="user/password" />
            <Input placeholder="Type something here..." className="grow" />
            <TrashIcon className="w-6 h-6 text-gray-500" />
          </div>
          <Input placeholder="Type something here..." />
        </div>
      </FormGroup>
      <FormGroup>
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <SelectDropdown options={[{ label: "User/Password", value: "user/password" }]} value="user/password" />
            <Input placeholder="Type something here..." className="grow" />
            <TrashIcon className="w-6 h-6 text-gray-500" />
          </div>
          <Input placeholder="Type something here..." />
        </div>
      </FormGroup>
      <IconButton text="Add Security Requirements" icon={AddIcon} />
    </FormSection>
    <FormSection title="Tags">
      <div></div>
    </FormSection>
    <FormSection title="External Documentation">
      <Field name="url" label="URL">
        <Input placeholder="https://www.mycompany.com/private/docs/production-kafka-broker" />
      </Field>
      <DescriptionWithLabel
        label="Description"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna,"
      />
    </FormSection>
  </Form>
)
