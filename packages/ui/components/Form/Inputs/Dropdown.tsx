import * as RadixSelect from '@radix-ui/react-select'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '../../icons'
import classnames from 'classnames'

type DropdownRegularOption = {
  type?: 'regular'
  value: string
  label: string
}

type DropdownRegularOptionProps = {
  option: DropdownRegularOption
}

const DropdownRegularOption = ({ option: { value, label } }: DropdownRegularOptionProps) => {
  return (
    <RadixSelect.Item
      className="flex items-center cursor-default relative text-gray-200 text-sm leading-7 pl-6 pr-7 hover:bg-gray-700 focus:bg-gray-700 my-2 rounded outline-none"
      value={value}
    >
      <RadixSelect.ItemText>{label}</RadixSelect.ItemText>
      <RadixSelect.ItemIndicator className="absolute left-0 inline-flex items-center justify-center">
        <CheckIcon className="w-4 h-4 pl-1" />
      </RadixSelect.ItemIndicator>
    </RadixSelect.Item>
  )
}

type DropdownGroupOption = {
  type: 'group'
  label: string
  options: DropdownRegularOption[]
}

type DropdownGroupOptionProps = {
  option: DropdownGroupOption
}

const DropdownGroupOption = ({ option: { label, options } }: DropdownGroupOptionProps) => {
  return (
    <RadixSelect.Group>
      <RadixSelect.Label className="text-xs text-gray-500 px-4 leading-6">{label}</RadixSelect.Label>
      {options.map((option) => (
        <DropdownRegularOption option={option} key={option.value} />
      ))}
    </RadixSelect.Group>
  )
}
type DropdownSeparatorOption = {
  type: 'separator'
}

const DropdownSeparatorOption = () => {
  return <RadixSelect.Separator className="w-full h-px bg-gray-700 my-2" />
}

export type DropdownOption = DropdownGroupOption | DropdownRegularOption | DropdownSeparatorOption

type DropdownOptionProps = {
  option: DropdownOption
}

const DropdownOption = ({ option }: DropdownOptionProps) => {
  switch (option.type) {
  case 'separator':
    return <DropdownSeparatorOption />
  case 'group':
    return <DropdownGroupOption option={option} />
  default:
    return <DropdownRegularOption option={option} />
  }
}

export type DropdownProps = {
  options: DropdownOption[]
  value?: string
  onChange?: (selectedOption: string) => void
  placeholder?: string
  isDisabled?: boolean
  name?: string
  className?: string
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  name,
  isDisabled,
  className,
}: DropdownProps) {
  return (
    <RadixSelect.Root value={value} onValueChange={onChange} name={name} disabled={isDisabled}>
      <RadixSelect.Trigger
        aria-label={placeholder}
        className={classnames(
          className,
          'flex items-center justify-between rounded-md border border-gray-700 px-3 text-sm leading-6 h-[46px] gap-2 bg-gray-900 text-gray-100 min-w-[176px]',
          { 'opacity-50': isDisabled }
        )}
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon className="text-gray-500">
          <ChevronDownIcon className="w-5 h-5" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content className="overflow-hidden min-w-[176px] bg-gray-900 rounded-md px-2.5 shadow">
          <RadixSelect.ScrollUpButton className="flex justify-center items-center">
            <ChevronUpIcon className="w-4 h-4 text-gray-500" />
          </RadixSelect.ScrollUpButton>
          <RadixSelect.Viewport>
            {options.map((option, index) => (
              <DropdownOption option={option} key={index} />
            ))}
          </RadixSelect.Viewport>
          <RadixSelect.ScrollDownButton className="flex justify-center items-center">
            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
          </RadixSelect.ScrollDownButton>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  )
}
