/* eslint-disable import/no-anonymous-default-export */
import { ServiceInfoBadge } from '@asyncapi/studio-ui'

export default {
  component: ServiceInfoBadge,
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  }
}

export const HTTP = {
  args: {
    info: 'http'
  }
}

export const Server = {
  args: {
    info: 'server'
  }
}

export const Client = {
  args: {
    info: 'client'
  }
}

export const Kafka = {
  args: {
    info: 'kafka'
  }
}

export const Websocket = {
  args: {
    info: 'websocket'
  }
}

export const AMQP = {
  args: {
    info: 'amqp'
  }
}

export const MQTT = {
  args: {
    info: 'mqtt'
  }
}

export const GooglePubSub = {
  args: {
    info: 'googlepubsub'
  }
}

export const IBMMQ = {
  args: {
    info: 'ibmmq'
  }
}

export const NATS = {
  args: {
    info: 'nats'
  }
}

export const Pulsar = {
  args: {
    info: 'pulsar'
  }
}

export const Redis = {
  args: {
    info: 'redis'
  }
}

export const SNS = {
  args: {
    info: 'sns'
  }
}

export const SQS = {
  args: {
    info: 'sqs'
  }
}

export const Solace = {
  args: {
    info: 'solace'
  }
}

export const STOMP = {
  args: {
    info: 'stomp'
  }
}
