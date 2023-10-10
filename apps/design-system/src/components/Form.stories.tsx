import React from 'react'
import type { Meta } from "@storybook/react"
import {
  TextArea,
  Field,
  Form,
  FormGroup,
  FormSection,
  IconButton,
  TextInput,
  Label,
  SelectDropdown,
  ChipInput,
} from "@asyncapi/studio-ui"
import { AddIcon, TrashIcon } from "@asyncapi/studio-ui/icons"

const meta: Meta<typeof Form> = {
  component: Form,
  parameters: {
    layout: "fullscreen"
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
  <>
  <Form
    title="User Registration"
    summary="Type a short summary description..."
    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu condimentum mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu condimentum mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu condimentum mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu condimentum mauris.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu condimentum mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu condimentum mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu condimentum mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu condimentum mauris"
  >
  <div className="flex flex-col gap-4">
    <Field name="summary">
      <TextArea placeholder="Type a short summary description..." rows={1}/>
    </Field>
    <Field name="description">
      <TextArea rows={5} value='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu condimentum mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu condimentum mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu condimentum mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu condimentum mauris.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu condimentum mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu condimentum mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu condimentum mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu condimentum mauris' placeholder={'Type a description...'}/>
    </Field>
  </div>
    <FormSection title="Connection Details">
      <div className="flex gap-3">
        <Field name="protocol" label="Protocol">
          <SelectDropdown options={singleSelectOptions} placeholder="Select a protocol..." />
        </Field>
        <Field name="host" label="Host" className="grow" tooltip='Server host url.'>
          <TextInput value='kafka.in.mycompany.com:{port}/production' placeholder="" className='w-full' />
        </Field>
      </div>
      <div className="flex gap-3">
        <Field className="grow" label="Schema Registry URL" name={"schema"}>
          <TextInput value="https://registry.mycompay.com" placeholder="" />
        </Field>
        <Field className="grow" label="Schema Registry Vendor" name={"vendor"}>
          <TextInput value="Confluent" placeholder="" />
        </Field>
      </div>
      <Label label={"Security"} />
      <FormGroup>
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <SelectDropdown options={[{ label: "User/Password", value: "user/password" }]} value="user/password" />
            <TextInput placeholder="Type something here..." className="grow" />
            <TrashIcon className="w-6 h-6 text-gray-500" />
          </div>
          <TextInput placeholder="Type something here..." />
        </div>
      </FormGroup>
      <FormGroup>
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <SelectDropdown options={[{ label: "User/Password", value: "user/password" }]} value="user/password" />
            <TextInput placeholder="Type something here..." className="grow" />
            <TrashIcon className="w-6 h-6 text-gray-500" />
          </div>
          <TextInput placeholder="Type something here..." />
        </div>
      </FormGroup>
      <IconButton text="Add Security Requirements" icon={AddIcon} />
    </FormSection>
    <FormSection title="Tags">
      <div>
        <ChipInput name={''} id={''} chips={["production", "platform"]} onChange={()=> {return}} />
      </div>
    </FormSection>
    <FormSection title="External Documentation">
      <Field name="url" label="URL">
        <TextInput placeholder="https://www.mycompany.com/private/docs/production-kafka-broker" />
      </Field>
      <Field name="description" label='Description'>
        <TextArea value='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna,' placeholder='' />
      </Field>
    </FormSection>
  </Form>
  </>
)
