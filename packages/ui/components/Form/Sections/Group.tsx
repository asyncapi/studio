import React from 'react'

type GroupProps = {
  children: React.ReactNode
  className?: string
}

export const Group = ({ children, className }: GroupProps) => {
  return <div className={`border-l p-2 border-gray-700 ${className}`}>{children}</div>
}
