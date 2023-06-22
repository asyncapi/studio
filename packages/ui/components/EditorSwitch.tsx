import React, { useState } from 'react'
import { Switch } from '@headlessui/react'
import { CodeBracketIcon, EyeIcon } from 'ui/icons'

export function EditorSwitch() {
  const [isCodeEditor, setIsCodeEditor] = useState(true)
  const transitionStyle = 'transition duration-200 ease-in-out'
  const visualIconStyle = `${transitionStyle} ${isCodeEditor ? 'stroke-gray-400' : 'stroke-white'}`
  const codeIconStyle = `${transitionStyle} ${isCodeEditor ? 'stroke-white' : 'stroke-gray-400'}`
  return (
    <Switch
      checked={isCodeEditor}
      onChange={setIsCodeEditor}
      className={`relative bg-gray-800 flex h-[35px] w-[62px] cursor-pointer rounded`}
    >
      <div className='absolute inset-[5px] flex flex-grow'>
        <div className='flex flex-grow justify-between content-center z-10 m-[4px]'>
          <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            className={visualIconStyle}
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M1.85684 8.21493C1.81078 8.07676 1.81074 7.92716 1.85671 7.78895C2.78229 5.00648 5.407 3 8.50035 3C11.5923 3 14.216 5.00462 15.1427 7.78507C15.1887 7.92325 15.1888 8.07285 15.1428 8.21105C14.2172 10.9935 11.5925 13 8.49918 13C5.40727 13 2.78356 10.9954 1.85684 8.21493Z'
              stroke-width='1.5'
              stroke-linecap='round'
              stroke-linejoin='round'
            />
            <path
              d='M10.4998 8C10.4998 9.10457 9.60437 10 8.4998 10C7.39524 10 6.4998 9.10457 6.4998 8C6.4998 6.89543 7.39524 6 8.4998 6C9.60437 6 10.4998 6.89543 10.4998 8Z'
              stroke-width='1.5'
              stroke-linecap='round'
              stroke-linejoin='round'
            />
          </svg>
          <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            className={codeIconStyle}
            xmlns='http://www.w3.org/2000/svg'
          >
            <g clip-path='url(#clip0_460_1066)'>
              <path
                d='M12 4.5L15.5 8L12 11.5M5 11.5L1.5 8L5 4.5M10 2.5L7 13.5'
                stroke-width='1.5'
                stroke-linecap='round'
                stroke-linejoin='round'
              />
            </g>
            <defs>
              <clipPath id='clip0_460_1066'>
                <rect width='16' height='16' fill='white' transform='translate(0.5)' />
              </clipPath>
            </defs>
          </svg>
        </div>
        <span
          aria-hidden='true'
          className={`${isCodeEditor ? 'translate-x-7' : 'translate-x-0'}
        pointer-events-none absolute h-[25px] inline-block w-[25px] transform rounded bg-primary transition duration-200 ease-in-out`}
        />
      </div>
    </Switch>
  )
}
