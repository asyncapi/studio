import type { FunctionComponent } from 'react'

interface ProtocolBadgeProps {
  className?: string
  protocol: 'http' | 'kafka' | 'websocket' | 'amqp' | 'mqtt' | 'googlepubsub' | 'ibmmq' | 'nats' | 'pulsar' | 'redis' | 'sns' | 'sqs' | 'solace' | 'stomp'
}

export const ProtocolBadge: FunctionComponent<ProtocolBadgeProps> = ({
  className = '',
  protocol
}) => {
  let colorName
  let content

  switch(protocol) {
    case 'http':
      colorName = 'cyan' // bg-cyan-100 text-cyan-900
      content = <span className="text-3xs font-bold">HTTP</span>
    break;
  }
  return (
    <div className={`inline-flex justify-center items-center bg-${colorName}-100 text-${colorName}-900 p-1 w-7 h-7 rounded ${className}`}>
      {content}
    </div>
  )
}

