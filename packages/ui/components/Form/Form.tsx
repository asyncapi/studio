import React from 'react'
import * as RadixForm from '@radix-ui/react-form'
import { Description } from './Labels/Description'

export type FormProps = {
  className?: string
  title?: string
  summary?: string
  description?: string
  children?: React.ReactNode
}
export const Form = ({ className, title, summary, description, children }: FormProps) => (
  <RadixForm.Root className={`m-8 ${className}`}>
    <div className="flex flex-col gap-4">
      {title && (
        <h2 className="text-transparent bg-gradient-to-l from-gray-100 via-gray-300 capitalize to-gray-100 bg-clip-text text-[32px] leading-8 font-semibold text-gray-200">
          {title}
        </h2>
      )}
      {summary && <p className="text-sm leading-4 italic font-normal text-gray-400">{summary}</p>}
      {description && <Description text={description} />}
    </div>
    <div>{children}</div>
  </RadixForm.Root>
)
