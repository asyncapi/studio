export type TextAreaProps = {
  onChange?: () => void
  rows?: number
  name?: string
  value?: string
  isResizable?: boolean
  placeholder: string
  isDisabled?: boolean
  className?: string
}

export const TextArea = ({onChange, rows, name, value, isDisabled, isResizable, placeholder, className} : TextAreaProps) => {
  return <textarea
    name={name}
    aria-label={name}
    value={value}
    onChange={onChange}
    disabled={isDisabled}
    placeholder={placeholder}
    rows={rows}
    className={`bg-gray-900 appearance-none placeholder-gray-500 placeholder:italic outline-none text-sm leading-5 text-gray-400 ${
      className
    } ${isDisabled && 'opacity-50'} ${!isResizable && 'resize-none'}`}
  />
}
