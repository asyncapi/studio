type TextInputProps = {
  placeholder: string
  type: "text" | "url"
  value: string
  onClear: () => void
  onChange: () => void
  isDisabled: boolean
  className: string
}

export const TextInput = ({ placeholder, type, value, onClear, onChange, isDisabled, className }: TextInputProps) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={isDisabled}
      className={`h-[46px] bg-gray-900 appearance-none inline-flex items-center justify-center rounded-md px-3 text-sm leading-4 font-medium text-gray-100 border border-gray-800 placeholder-gray-500 placeholder:italic outline-none ${className} ${
        isDisabled && "opacity-50"
      }`}
    />
  )
}
