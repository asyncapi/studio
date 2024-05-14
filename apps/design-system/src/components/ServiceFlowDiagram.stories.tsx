import { StoryObj, Meta } from "@storybook/react"

import { ServiceFlowDiagram, Server, Service, OperationAction } from "@asyncapi/studio-ui"

const meta: Meta<typeof ServiceFlowDiagram> = {
  component: ServiceFlowDiagram,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
    },
  },
  argTypes: {
    onAddOperation: { action: "onAddOperation" },
    onAddServer: { action: "onAddServer" },
    onOperationClick: { action: "onOperationClick" },
    onServerClick: { action: "onServerClick" },
    onServiceClick: { action: "onServiceClick" },
  },
}

export default meta

type Story = StoryObj<typeof ServiceFlowDiagram>

const operations = [
  { id: "sendUserHasBeenRemoved", action: OperationAction.SEND, source: "Production Kafka Broker" },
  { id: "sendUserSignedUp", action: OperationAction.SEND, source: "Production Kafka Broker" },
  { id: "onUserSignedUp", action: OperationAction.SEND, source: "A WebSocket Client" },
  { id: "POST /users", action: OperationAction.RECEIVE, source: "An HTTP Client" },
]

const service = {
  position: { x: 300, y: 400 },
  component: (
    <Service
      name={"User Registration"}
      isActive={true}
      description={
        "ucondimentum mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentumurna, eu condimentum mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuerefermentum urna, eu condimentum maur"
      }
      badges={["http", "kafka", "websocket"]}
      isClient={true}
      isServer={false}
    />
  ),
}

const servers = [
  {
    id: "Production Kafka Broker",
    position: { x: service.position.x - 20, y: service.position.y - 300 },
    component: <Server name={"Production Kafka Broker"} icon={"kafka"} url={"kafka.in.mycompany.com/production"} />,
  },
  {
    id: "A Yet Unused Server",
    position: { x: service.position.x + 300, y: service.position.y - 300 },
    component: <Server name={"A Yet Unused Server"} icon={"kafka"} url={"kafka.in.mycompany.com/unused"} />,
  },
  {
    id: "A WebSocket Client",
    position: { x: service.position.x - 20, y: service.position.y + 500 },
    component: <Server name={"A WebSocket Client"} icon={"websocket"} isFaded />,
  },
  {
    id: "An HTTP Client",
    position: { x: service.position.x + 300, y: service.position.y + 500 },
    component: <Server name={"An HTTP Client"} icon={"http"} isFaded />,
  },
]

const addServerButtonPosition =  { x: service.position.x + 600, y: service.position.y - 300 }

export const Default: Story = {
  args: {
    service,
    operations,
    addServerButtonPosition,
    servers,
  },
}

export const WithOneServer: Story = {
  args: {
    service,
    addServerButtonPosition,
    operations,
    servers: [servers[0]],
  },
}

const withOperationSelected = [
  { id: "sendUserHasBeenRemoved", action: OperationAction.SEND, source: "Production Kafka Broker", selected: true },
  { id: "sendUserSignedUp", action: OperationAction.SEND, source: "Production Kafka Broker" },
]

export const WithOperationSelected: Story = {
  args: {
    service,
    addServerButtonPosition,
    operations: withOperationSelected,
    servers: [servers[0]],
  },
}

const operationsTooMany = new Array(20).fill("").map((_, i) => ({ id: `${i% 3 === 0 ? "receive": "send"}Operation${i}`, action:  i% 3 === 0 ? OperationAction.RECEIVE : OperationAction.SEND, source: 'Production Kafka Broker' }));
export const WithTooManyOperations: Story = {
  args: {
    service,
    operations: operationsTooMany,
    addServerButtonPosition,
    servers: [servers[0]],
  },
}
