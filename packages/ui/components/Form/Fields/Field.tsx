import React from "react"
import { Label } from "../Labels/Label"
import * as RadixForm from "@radix-ui/react-form"

type FieldProps = {
  name: string
  className?: string
  label: string
  tooltip?: string
  children: React.ReactNode
}

export const Field: React.FunctionComponent<FieldProps> = ({ label, tooltip, children, className, name }) => {
  return (
    <RadixForm.Field name={name} className={`flex flex-col gap-2 ${className}`}>
      <RadixForm.Label asChild>
        <Label label={label} tooltip={tooltip} />
      </RadixForm.Label>
      <RadixForm.Control asChild>{children}</RadixForm.Control>
    </RadixForm.Field>
  )
}
