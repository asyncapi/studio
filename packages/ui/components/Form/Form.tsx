import React from 'react'
import * as RadixForm from '@radix-ui/react-form'

export type FormProps = {
  className?: string
  title?: string
  children?: React.ReactNode
}
export const Form = ({ className, title, children }: FormProps) => (
  <RadixForm.Root className={`m-8 ${className}`} aria-label={title}>
    <div className="flex flex-col gap-4">
      {title && (
        <h2 className="mb-4 text-transparent bg-gradient-to-l from-gray-100 via-gray-300 capitalize to-gray-100 bg-clip-text text-[32px] leading-8 font-semibold text-gray-200">
          {title}
        </h2>
      )}
    </div>
    <div>{children}</div>
  </RadixForm.Root>
)
