import React from 'react'
import * as RadixTooltip from '@radix-ui/react-tooltip'
import type { TooltipContentProps } from '@radix-ui/react-tooltip'

const TooltipContent: React.FunctionComponent<TooltipContentProps> = ({
  side = 'right',
  className = '',
  sideOffset = 5,
  children,
}) => {
  return (
    <RadixTooltip.Portal>
      <RadixTooltip.Content className={`text-xs text-gray-300 bg-gray-950 text-center p-2 rounded shadow ${className}`} side={side} sideOffset={sideOffset}>
        {children}
        <RadixTooltip.Arrow className="fill-gray-950 shadow" />
      </RadixTooltip.Content>
    </RadixTooltip.Portal>
  )
}

export default {
  Content: TooltipContent,
  Provider: RadixTooltip.Provider,
  Root: RadixTooltip.Root,
  Trigger: RadixTooltip.Trigger
}
