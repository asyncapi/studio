import React from 'react'

type FormGroupProps = {
  children: React.ReactNode
}

export const FormGroup = ({ children }: FormGroupProps) => {
  return <div className="border-l p-2 border-gray-700">{children}</div>
}
