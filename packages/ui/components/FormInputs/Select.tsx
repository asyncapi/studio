import React, { FunctionComponent, ReactNode, useRef } from 'react'
import * as RadixSelect from '@radix-ui/react-select'
import { ChevronDownIcon, ChevronUpIcon } from '../icons'
import classnames from 'classnames'

type SelectItemProps = {
  className?: string
  children: React.ReactNode
  value: string
}

const SelectItem = React.forwardRef<HTMLInputElement, SelectItemProps>(
  ({ children, value, className, ...props }: SelectItemProps, forwardedRef) => {
    return (
      <RadixSelect.Item
        className={classnames(
          'text-gray-200 text-sm leading-7 px-2.5 hover:bg-gray-700 focus:bg-gray-700 my-2 rounded outline-none',
          className
        )}
        value={value}
        {...props}
        ref={forwardedRef}
      >
        <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
      </RadixSelect.Item>
    )
  }
)

type SelectItem = {
  value: string
  label: string
}
type SelectProps = {
  options: SelectItem[]
  value: SelectItem
  onChange: () => {}
  placeholder: string
  isDisabled: boolean
  name: string
}

export default function Select({ options, value, onChange, placeholder, isDisabled, name }: SelectProps) {
  return (
    <RadixSelect.Root>
      <RadixSelect.Trigger
        aria-label='Protocol'
        className='flex items-center justify-between rounded-md border border-gray-700 px-3 text-sm leading-6 h-10 gap-2 bg-gray-900 text-gray-100 min-w-[176px]'
      >
        <RadixSelect.Value placeholder='Select a protocol...' />
        <RadixSelect.Icon className='text-gray-500'>
          <ChevronDownIcon className='w-5 h-5' />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content className='min-w-[176px] bg-gray-900 rounded-md px-2.5 shadow'>
          <RadixSelect.ScrollUpButton className='flex justify-center items-center'>
            <ChevronUpIcon className='w-4 h-4 text-gray-500' />
          </RadixSelect.ScrollUpButton>
          <RadixSelect.Viewport>
            {options.map((option) => (
              <SelectItem value={option.value}>{option.label}</SelectItem>
            ))}
          </RadixSelect.Viewport>
          <RadixSelect.ScrollDownButton className='flex justify-center items-center'>
            <ChevronDownIcon className='w-4 h-4 text-gray-500' />
          </RadixSelect.ScrollDownButton>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  )
}
