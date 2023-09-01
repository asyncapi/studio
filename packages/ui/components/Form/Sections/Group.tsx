import { FunctionComponent } from "react"
import { Label } from "../Labels"
import { Separator } from "@radix-ui/themes"

type FormGroupProps = {
  children: React.ReactNode
}

export const FormGroup: FunctionComponent<FormGroupProps> = ({ children }) => {
  return <div className="border-l p-2 border-gray-700">{children}</div>
}
