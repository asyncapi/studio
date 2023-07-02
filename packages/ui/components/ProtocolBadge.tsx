import type { FunctionComponent } from 'react'
import { AMQPIcon, KafkaIcon, WebSocketIcon } from './icons'

interface ProtocolBadgeProps {
  className?: string
  protocol: 'http' | 'kafka' | 'websocket' | 'amqp' | 'mqtt' | 'googlepubsub' | 'ibmmq' | 'nats' | 'pulsar' | 'redis' | 'sns' | 'sqs' | 'solace' | 'stomp'
}

export const ProtocolBadge: FunctionComponent<ProtocolBadgeProps> = ({
  className = '',
  protocol,
  ...props
}) => {
  let colorName
  let content
  let ariaLabel

  switch(protocol) {
    case 'http':
      ariaLabel = 'HTTP'
      colorName = 'cyan' // bg-cyan-100 text-cyan-900
      content = <span className="text-3xs font-bold">HTTP</span>
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
  }
  return (
    <div className={`inline-flex justify-center items-center bg-${colorName}-100 text-${colorName}-900 p-1 w-7 h-7 rounded ${className}`} aria-label={ariaLabel} {...props}>
      {content}
    </div>
  )
}

