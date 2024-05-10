import React from 'react'

import { cn } from '@asyncapi/studio-utils'

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      ' bg-gray-800 border-gray-700 rounded-lg  border-2',
      className
    )}
    {...props}
  />
))
Card.displayName = 'Card'

export { Card }
