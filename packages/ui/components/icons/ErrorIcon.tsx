import type React from 'react';

const ErrorIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
    <g transform="scale(0.571429)">
      <path d="M21 4.42105C11.8437 4.42105 4.42105 11.8437 4.42105 21C4.42105 30.1563 11.8437 37.5789 21 37.5789C30.1563 37.5789 37.5789 30.1563 37.5789 21C37.5789 11.8437 30.1563 4.42105 21 4.42105ZM0 21C0 9.40202 9.40202 0 21 0C32.598 0 42 9.40202 42 21C42 32.598 32.598 42 21 42C9.40202 42 0 32.598 0 21Z" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <path d="M12.3229 12.6471L29 29.0286M28.7044 12.6471L12.3229 29.0286" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
    </g>
  </svg>
);

ErrorIcon.displayName = 'ErrorIcon';

export default ErrorIcon;
