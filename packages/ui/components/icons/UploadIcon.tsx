import type React from 'react';

const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g transform="scale(0.571429)">
      <path d="M21 7.875V25.375M21 7.875C19.7746 7.875 17.4852 11.365 16.625 12.25M21 7.875C22.2254 7.875 24.5148 11.365 25.375 12.25" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M35 28.875C35 33.2185 34.0935 34.125 29.75 34.125H12.25C7.9065 34.125 7 33.2185 7 28.875" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

UploadIcon.displayName = 'UploadIcon';

export default UploadIcon;
