import { StoryObj, Meta } from '@storybook/react'

import { ServiceFlowDiagram, Server, Service } from '@asyncapi/studio-ui'
import type { FlowDiagramServer, FlowDiagramOperation, ServerPlacement } from '@asyncapi/studio-ui'

const meta: Meta<typeof ServiceFlowDiagram> = {
  component: ServiceFlowDiagram,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark'
    },
  },
  argTypes: {
    onAddOperation: { action: 'onAddOperation' },
    onAddServer: { action: 'onAddServer' },
    onOperationClick: { action: 'onOperationClick' },
    onServerClick: { action: 'onServerClick' },
    onServiceClick: { action: 'onServiceClick' },
  }
}


export default meta

type Story = StoryObj<typeof ServiceFlowDiagram>

const operations = new Map<string, FlowDiagramOperation>([
  ['sendUserHasBeenRemoved', { type: 'send', source: 'Production Kafka Broker' }],
  ['sendUserSignedUp', { type: 'send', source: 'Production Kafka Broker' }],
  ['onUserSignedUp', { type: 'send', source: 'A WebSocket Client' }],
  ['POST /users', { type: 'receive', source: 'An HTTP Client' }]
]);


const servers = new Map<ServerPlacement, FlowDiagramServer>([
  ["top-left", {  id: "Production Kafka Broker", component: <Server name={'Production Kafka Broker'} icon={'kafka'} url={'kafka.in.mycompany.com/production'} />}],
  ["top-right", {  id: "A Yet Unused Server", component: <Server name={'A Yet Unused Server'} icon={'kafka'} url={'kafka.in.mycompany.com/unused'} />}],
  ["bottom-left", {  id: "A WebSocket Client", component: <Server name={'A WebSocket Client'} icon={'websocket'} isFaded />}],
  ["bottom-right", {  id: "An HTTP Client", component: <Server name={'An HTTP Client'} icon={'http'} isFaded />}]
]);

export const Default: Story = {
  args: {
    service: { position: { x: 300, y: 400 }, component: <Service
    name={"User Registration"}
    isActive={true}
    description={
      "ucondimentum mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentumurna, eu condimentum mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuerefermentum urna, eu condimentum maur"
    }
    badges={["http", "kafka", "websocket"]}
    isClient={true}
    isServer={false}
  /> },
    operations,
    servers
  },
}


export const WithOneServer: Story = {
  args: {
    service: { position: { x: 300, y: 400 }, component: <Service
    name={"User Registration"}
    isActive={true}
    description={
      "ucondimentum mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentumurna, eu condimentum mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuerefermentum urna, eu condimentum maur"
    }
    badges={["http", "kafka", "websocket"]}
    isClient={true}
    isServer={false}
  /> },
    operations,
    servers: new Map(Array.from(servers.entries()).slice(0, 1))
  },
}


const operationsSelected = new Map<string, FlowDiagramOperation>([
  ['sendUserHasBeenRemoved', { type: 'send', source: 'Production Kafka Broker', selected: true }],
  ['sendUserSignedUp', { type: 'send', source: 'Production Kafka Broker' }],
]);

export const WithOperationSelected: Story = {
  args: {
    service: { position: { x: 300, y: 400 }, component: <Service
    name={"User Registration"}
    isActive={true}
    description={
      "ucondimentum mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentumurna, eu condimentum mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuerefermentum urna, eu condimentum maur"
    }
    badges={["http", "kafka", "websocket"]}
    isClient={true}
    isServer={false}
  /> },
    operations: operationsSelected,
    servers: new Map(Array.from(servers.entries()).slice(0, 1))
  },
}


const operationsTooMany = new Array(20).fill("").reduce((acc, _, i) => {
  console.log(i)
  acc.set(`sendUserHasBeenRemoved${i}`, { type: 'send', source: 'Production Kafka Broker' });
  return acc;
}, new Map<string, FlowDiagramOperation>())

console.log(operationsTooMany)
export const WithTooManyOperations: Story = {
  args: {
    service: { position: { x: 300, y: 400 }, component: <Service
    name={"User Registration"}
    isActive={true}
    description={
      "ucondimentum mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentumurna, eu condimentum mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuerefermentum urna, eu condimentum maur"
    }
    badges={["http", "kafka", "websocket"]}
    isClient={true}
    isServer={false}
  /> },
    operations: operationsTooMany,
    servers: new Map(Array.from(servers.entries()).slice(0, 1))
  },
}
