import { Info, ServiceInfoBadge } from './ServiceInfoBadge';

interface AppCardProps {
  isActive?: boolean;
  name: string;
  description: string;
  badges: Info[];
  isClient: boolean;
  isServer: boolean;
  className?: string;
}

export const AppCard = ({isActive = false, name, description, badges, className, isClient, isServer}:AppCardProps) => {
  return (
    <>
      <div
        aria-label={`${name} Application Card, ${isActive ? 'active' : 'inactive'}`}
        className={`bg-gray-800 border-gray-800 rounded-lg max-w-[523px] w-full border-2 ${className} ${
          isActive ? ' border-pink-800/30 shadow-active' : ''
        }`}
      >
        <div className="flex flex-col gap-2 px-5 py-3">
          <h3 className="text-base font-medium text-gray-100">{name}</h3>
          <div className='flex gap-1'>
            { (isClient || isServer) && 
            <div className='mr-2 flex gap-1'>
              {isClient && <ServiceInfoBadge info='client'/>}
              {isServer && <ServiceInfoBadge info='server'/>}
            </div>
            }
            {badges.map((badge, index) => (<ServiceInfoBadge info={badge} key={index} />))}
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