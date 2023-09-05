import React from 'react'
import * as RadixSelect from '@radix-ui/react-select'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '../../icons'
import classnames from 'classnames'

type SelectDropdownRegularOption = {
  type?: 'regular'
  value: string
  label: string
}

type SelectDropdownRegularOptionProps = {
  option: SelectDropdownRegularOption
}

const SelectDropdownRegularOption = ({ option: { value, label } }: SelectDropdownRegularOptionProps) => {
  return (
    <RadixSelect.Item
      className="flex items-center relative text-gray-200 text-sm leading-7 pl-6 pr-7 hover:bg-gray-700 focus:bg-gray-700 my-2 rounded outline-none"
      value={value}
    >
      <RadixSelect.ItemText>{label}</RadixSelect.ItemText>
      <RadixSelect.ItemIndicator className="absolute left-0 inline-flex items-center justify-center">
        <CheckIcon className="w-4 h-4 pl-1" />
      </RadixSelect.ItemIndicator>
    </RadixSelect.Item>
  )
}

type SelectDropdownGroupOption = {
  type: 'group'
  label: string
  options: SelectDropdownRegularOption[]
}

type SelectDropdownGroupOptionProps = {
  option: SelectDropdownGroupOption
}

const SelectDropdownGroupOption = ({ option: { label, options } }: SelectDropdownGroupOptionProps) => {
  return (
    <>
      <RadixSelect.Group>
        <RadixSelect.Label className="text-xs text-gray-500 px-4 leading-6">{label}</RadixSelect.Label>
        {options.map((option) => (
          <SelectDropdownRegularOption option={option} key={option.value} />
        ))}
      </RadixSelect.Group>
    </>
  )
}
type SelectDropdownSeparatorOption = {
  type: 'separator'
}

const SelectDropdownSeparatorOption = () => {
  return <RadixSelect.Separator className="w-full h-px bg-gray-700 my-2" />
}

export type SelectDropdownOption = SelectDropdownGroupOption | SelectDropdownRegularOption | SelectDropdownSeparatorOption

type SelectDropdownOptionProps = {
  option: SelectDropdownOption
}

const SelectDropdownOption = ({ option }: SelectDropdownOptionProps) => {
  switch (option.type) {
  case 'separator':
    return <SelectDropdownSeparatorOption />
  case 'group':
    return <SelectDropdownGroupOption option={option} />
  default:
    return <SelectDropdownRegularOption option={option} />
  }
}

export type SelectDropdownProps = {
  options: SelectDropdownOption[]
  value?: string
  onChange?: (selectedOption: string) => void
  placeholder?: string
  isDisabled?: boolean
  name?: string
  label?: string
  className?: string
}

export function SelectDropdown({
  options,
  value,
  onChange,
  placeholder,
  name,
  isDisabled,
  className,
}: SelectDropdownProps) {
  return (
    <>
      <RadixSelect.Root value={value} onValueChange={onChange} name={name} disabled={isDisabled}>
        <RadixSelect.Trigger
          aria-label="Protocol"
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
                <SelectDropdownOption option={option} key={index} />
              ))}
            </RadixSelect.Viewport>
            <RadixSelect.ScrollDownButton className="flex justify-center items-center">
              <ChevronDownIcon className="w-4 h-4 text-gray-500" />
            </RadixSelect.ScrollDownButton>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </>
  )
}
