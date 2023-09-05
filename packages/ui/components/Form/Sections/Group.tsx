import React, { FunctionComponent } from 'react'

type FormGroupProps = {
  children: React.ReactNode
}

export const FormGroup: FunctionComponent<FormGroupProps> = ({ children }) => {
  return <div className="border-l p-2 border-gray-700">{children}</div>
}
