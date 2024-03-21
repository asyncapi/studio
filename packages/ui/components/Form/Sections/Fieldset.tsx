import React from 'react'

type FieldsetProps = {
  className?: string
  title: string
  children: React.ReactNode
}

export const Fieldset = ({ title, children, className }: FieldsetProps) => {
  return (
    <fieldset className={`flex flex-col mt-8 gap-4 ${className}`}>
      {title && <legend className="text-sm font-normal uppercase leading-6 text-gray-200 mb-4">{title}</legend>}
      {children}
    </fieldset>
  )
}
