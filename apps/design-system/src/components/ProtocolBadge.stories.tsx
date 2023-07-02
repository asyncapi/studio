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

export const GooglePubSub = {
  args: {
    protocol: 'googlepubsub'
  }
}

export const IBMMQ = {
  args: {
    protocol: 'ibmmq'
  }
}

export const NATS = {
  args: {
    protocol: 'nats'
  }
}

export const Pulsar = {
  args: {
    protocol: 'pulsar'
  }
}

export const Redis = {
  args: {
    protocol: 'redis'
  }
}

export const SNS = {
  args: {
    protocol: 'sns'
  }
}

export const SQS = {
  args: {
    protocol: 'sqs'
  }
}
