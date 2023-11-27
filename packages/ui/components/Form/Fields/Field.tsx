import React from 'react'
import { Label } from '../Labels/Label'
import * as RadixForm from '@radix-ui/react-form'

type FieldProps = {
  name: string
  className?: string
  label?: string
  tooltip?: string
  children: React.ReactNode
}

export const Field = ({ label, tooltip, children, className, name }: FieldProps) => {
  return (
    <RadixForm.Field name={name} className={`flex flex-col gap-2 ${className}`}>
      { label &&
      <RadixForm.Label>
        <Label label={label} tooltip={tooltip} aria-describedby={tooltip ? `${name}-tooltip` : undefined} />
      </RadixForm.Label>
      }
      <RadixForm.Control asChild>{children}</RadixForm.Control>
    </RadixForm.Field>
  )
}
