import type { FunctionComponent } from 'react'
import { AMQPIcon, AWSSNSIcon, AWSSQSIcon, ClientIcon, GooglePubSubIcon, IBMMQIcon, KafkaIcon, MQTTIcon, NATSIcon, PulsarIcon, RedisIcon, ServerIcon, SolaceIcon, StompIcon, WebSocketIcon } from './icons'

export type Info = 'http' | 'kafka' | 'websocket' | 'amqp' | 'mqtt' | 'googlepubsub' | 'ibmmq' | 'nats' | 'pulsar' | 'redis' | 'sns' | 'sqs' | 'solace' | 'stomp' | 'client' | 'server'
interface ServiceInfoBadgeProps {
  className?: string
  info: Info
}

export const ServiceInfoBadge: FunctionComponent<ServiceInfoBadgeProps> = ({
  className = '',
  info,
  ...props
}) => {
  let colorName
  let content
  let ariaLabel

  switch (info) {
  case 'http':
    ariaLabel = 'HTTP'
    colorName = 'cyan' // bg-cyan-100 text-cyan-900
    content = <span className="text-3xs font-bold">HTTP</span>
    break;
  case 'client':
    ariaLabel = 'Client'
    colorName = 'orange' // bg-orange-100 text-orange-900
    content = <ClientIcon className="w-4 h-4" />
    break;
  case 'server':
    ariaLabel = 'Server'
    colorName = 'blue' // bg-blue-100 text-blue-900
    content = <ServerIcon className="w-4 h-4" />
    break;
  case 'kafka':
    ariaLabel = 'Kafka'
    colorName = 'indigo' // bg-indigo-100 text-indigo-900
    content = <KafkaIcon className="w-4 h-4" />
    break;
  case 'websocket':
    ariaLabel = 'WebSocket'
    colorName = 'emerald' // bg-emerald-100 text-emerald-900
    content = <WebSocketIcon className="w-4 h-4" />
    break;
  case 'amqp':
    ariaLabel = 'AMQP'
    colorName = 'blue' // bg-blue-100 text-blue-900
    content = <AMQPIcon className="w-4 h-4" />
    break;
  case 'mqtt':
    ariaLabel = 'MQTT'
    colorName = 'purple' // bg-purple-100 text-purple-900
    content = <MQTTIcon className="w-4 h-4" />
    break;
  case 'googlepubsub':
    ariaLabel = 'Google PubSub'
    colorName = 'sky' // bg-sky-100 text-sky-900
    content = <GooglePubSubIcon className="w-4 h-4" />
    break;
  case 'ibmmq':
    ariaLabel = 'IBM MQ'
    colorName = 'sky' // bg-sky-100 text-sky-900
    content = <IBMMQIcon className="w-4 h-4" />
    break;
  case 'nats':
    ariaLabel = 'NATS'
    colorName = 'green' // bg-green-100 text-green-900
    content = <NATSIcon className="w-4 h-4" />
    break;
  case 'pulsar':
    ariaLabel = 'Pulsar'
    colorName = 'cyan' // bg-cyan-100 text-cyan-900
    content = <PulsarIcon className="w-4 h-4" />
    break;
  case 'redis':
    ariaLabel = 'Redis'
    colorName = 'red' // bg-red-100 text-red-900
    content = <RedisIcon className="w-4 h-4" />
    break;
  case 'sns':
    ariaLabel = 'AWS SNS'
    colorName = 'pink' // bg-pink-100 text-pink-900
    content = <AWSSNSIcon className="w-4 h-4" />
    break;
  case 'sqs':
    ariaLabel = 'AWS SQS'
    colorName = 'yellow' // bg-yellow-100 text-yellow-900
    content = <AWSSQSIcon className="w-4 h-4" />
    break;
  case 'solace':
    ariaLabel = 'Soalce'
    colorName = 'green' // bg-green-100 text-green-900
    content = <SolaceIcon className="w-4 h-4" />
    break;
  case 'stomp':
    ariaLabel = 'STOMP'
    colorName = 'orange' // bg-orange-100 text-orange-900
    content = <StompIcon className="w-4 h-4" />
    break;
  }
  return (
    <div className={`inline-flex justify-center items-center bg-${colorName}-100 text-${colorName}-900 p-1 w-7 h-7 rounded ${className}`} aria-label={ariaLabel} {...props}>
      {content}
    </div>
  )
}

