import { cn } from '@asyncapi/studio-utils'
import React, { ReactNode } from 'react'

interface EdgeLabelProps {
  selected: boolean | undefined
  label: string | ReactNode
  labelX: number
  labelY: number
  className?: string
  orientation?: "horizontal" | "vertical"
}

function EdgeTextLabel({ selected, label, labelX, labelY, className, orientation = "horizontal" }: EdgeLabelProps) {
  return (
    <div
    className={cn("text-gray-300 font-medium absolute pointer-events-auto text-[10px] leading-[10px] bg-gray-900 px-1", selected && "text-pink-500", className)}
    style={{
      transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px) ${orientation === "vertical" ? `rotate(-90deg)` : ""}`,
    }}
  >
    {label}
  </div>
  )
}

export default EdgeTextLabel
