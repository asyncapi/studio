import { Protocol, ProtocolBadge } from './ProtocolBadge';

interface AppCardProps {
  isActive?: boolean;
  name: string;
  description: string;
  protocols: Protocol[]
  className?: string;
}

export const AppCard = ({isActive = false, name, description, protocols, className}:AppCardProps) => {
  return (
    <>
      <div
        className={`bg-gray-800 border-gray-800 rounded-lg w-[523px] border-2 ${className} ${
          isActive ? ' border-pink-800/30 shadow-service-card' : ''
        }`}
      >
        <div className="flex flex-col gap-2 px-5 py-3">
          <h3 className="text-base font-medium text-gray-100">{name}</h3>
          <div className='flex gap-1'>
            {protocols.map((protocol, index) => (<ProtocolBadge protocol={protocol} key={index} />))}
          </div>
        </div>
        <div className="w-full h-px bg-gray-700"></div>
        <div className="px-5 py-[14px]">
          <p className="text-sm text-gray-400 line-clamp-6">{description}
          </p>
        </div>
      </div>
    </>
  )
}