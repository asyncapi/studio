import { cn } from '@asyncapi/studio-utils';
import { Info, ServiceInfoBadge } from './ServiceInfoBadge';
import { Card } from './Card';
import React from 'react';

interface AppCardProps {
  isActive?: boolean;
  name: string;
  description: string;
  badges: Info[];
  isClient: boolean;
  isServer: boolean;
  className?: string;
}

const Service = React.forwardRef<
HTMLDivElement,
AppCardProps
>(({isActive = false, name, description, badges, className, isClient, isServer}:AppCardProps, ref) => {
  const dedupedListOfBadges = Array.from(new Set(badges)).map((badge, index) => (<ServiceInfoBadge info={badge} key={badge + index} aria-hidden={true} />))
  const ariaDescriptionParts = [];
  if (isClient) ariaDescriptionParts.push('client');
  if (isServer) ariaDescriptionParts.push('server');
  const protocols = badges.map(badge => badge.toLowerCase()).join(', ');
  if (protocols) ariaDescriptionParts.push(`uses the following protocols: ${protocols}`);

  const ariaDescription = `This application, named ${name}, is ${ariaDescriptionParts.join(' and ')}.`;

  return (
      <Card className={cn('max-w-[523px] min-w-[523px] cursor-pointer', {"border-pink-800/30 shadow-active": isActive}, className)} aria-description={ariaDescription} ref={ref}>
        <div className="flex flex-col gap-2 px-5 py-3">
          <h3 className="text-base font-medium text-gray-100">{name}</h3>
          <div className='flex gap-1'>
            { (isClient || isServer) && 
            <div className='mr-2 flex gap-1'>
              {isClient && <ServiceInfoBadge info='client'/>}
              {isServer && <ServiceInfoBadge info='server'/>}
            </div>
            }
            {dedupedListOfBadges}
          </div>
        </div>
        <div className="w-full h-px bg-gray-700"></div>
        <div className="px-5 py-[14px]">
          <p className="text-sm text-gray-400 line-clamp-6">{description}
          </p>
        </div>
      </Card>
  )
})

Service.displayName = "Service"

export {Service}
