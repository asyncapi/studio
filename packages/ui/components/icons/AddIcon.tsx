import type React from 'react';

const AddIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g transform="scale(0.615385)">
      <path
        d="M19.5 14.625V24.375M24.375 19.5H14.625M34.125 19.5C34.125 27.5772 27.5772 34.125 19.5 34.125C11.4228 34.125 4.875 27.5772 4.875 19.5C4.875 11.4228 11.4228 4.875 19.5 4.875C27.5772 4.875 34.125 11.4228 34.125 19.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
)

AddIcon.displayName = 'AddIcon'

export default AddIcon
