import React, { FunctionComponent } from 'react'

type FormSectionProps = {
  className?: string
  title: string
  children: React.ReactNode
}

export const FormSection: FunctionComponent<FormSectionProps> = ({ title, children, className }) => {
  return (
    <div className={`flex flex-col gap-4 mt-8 ${className}`}>
      <h3 className="text-sm font-normal uppercase leading-6 text-gray-200">{title}</h3>
      {children}
    </div>
  )
}
