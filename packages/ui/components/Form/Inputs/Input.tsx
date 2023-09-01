import { TextField } from "@radix-ui/themes"

export type InputProps = {
  placeholder: string
  type?: "text" | "url"
  value?: string
  onClear?: () => void
  onChange?: () => void
  isDisabled?: boolean
  className?: string
}

export const Input = (props: InputProps) => {
  return (
    <input
      {...props}
      disabled={props.isDisabled}
      className={`h-[46px] bg-gray-900 appearance-none inline-flex items-center justify-center rounded-md px-3 text-sm leading-4 font-medium text-gray-100 border border-gray-700 placeholder-gray-500 placeholder:italic outline-none ${
        props.className
      } ${props.isDisabled && "opacity-50"}`}
    />
  )
}
