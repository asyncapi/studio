import { cn } from '@asyncapi/studio-utils'
import React, { ReactNode } from 'react'

interface EdgeLabelProps {
  label: ReactNode
  labelX: number
  labelY: number
  className?: string
}

function EdgeButtonLabel({ label, labelX, labelY, className }: EdgeLabelProps) {
  return (
    <div
    className={cn(`absolute pointer-events-auto bg-gray-900 cursor-pointer`, className)}
    style={{
      transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
    }}
  >
    {label}
  </div>
  )
}

export default EdgeButtonLabel
