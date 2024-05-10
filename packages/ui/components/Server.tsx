import { cn } from '@asyncapi/studio-utils';
import { Info, ServiceInfoBadge } from './ServiceInfoBadge';
import { Card } from './Card';
import React from 'react';

interface ServerProps {
  isActive?: boolean;
  isFaded?: boolean;
  name: string;
  icon: Info;
  url: string;
  className?: string;
}

const Server = React.forwardRef<
HTMLDivElement,
ServerProps
>(({isActive = false, isFaded = false, name, className, icon, url}, ref) => {
  return (
    <Card ref={ref} className={cn('w-[290px] border-dotted p-5', isActive && 'border-solid border-pink-800/30 drop-shadow-2xl shadow-active', isFaded && 'opacity-50', className)}>
      <div className='flex gap-2 align-middle'>
        <ServiceInfoBadge info={icon} aria-hidden={true} />
        <div className='flex flex-col justify-center'>
          <div className="text-base font-medium text-gray-100 leading-4">{name}</div>
          { url && <div className='font-normal text-xs leading-3 text-gray-400'>{url}</div>}
        </div>
      </div>
    </Card>
  )
})

Server.displayName = 'Server'

export {Server}
