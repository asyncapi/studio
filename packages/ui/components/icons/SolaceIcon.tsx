import type React from 'react';

const SolaceIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    {...props}
  >
    <circle  cx="14" cy="14" r="5"/>
  </svg>
)

SolaceIcon.displayName = 'SolaceIcon'

export default SolaceIcon
