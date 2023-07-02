/* eslint-disable import/no-anonymous-default-export */
import { ProtocolBadge } from 'ui'

export default {
  component: ProtocolBadge,
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  }
}

export const HTTP = {
  args: {
    protocol: 'http'
  }
}

export const Kafka = {
  args: {
    protocol: 'kafka'
  }
}

export const Websocket = {
  args: {
    protocol: 'websocket'
  }
}

export const AMQP = {
  args: {
    protocol: 'amqp'
  }
}

export const MQTT = {
  args: {
    protocol: 'mqtt'
  }
}
