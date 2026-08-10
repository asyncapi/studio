import type React from 'react';

const AlertIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
    <g transform="scale(0.571429)">
      <path d="M9.31299 16.9449C13.5369 9.47073 15.6489 5.73366 18.547 4.77167C20.1413 4.24245 21.8587 4.24245 23.453 4.77167C26.3511 5.73366 28.4631 9.47073 32.687 16.9449C36.9109 24.419 39.0229 28.1561 38.3894 31.2011C38.0408 32.8763 37.1821 34.3958 35.9363 35.5417C33.6718 37.6248 29.4479 37.6248 21 37.6248C12.5521 37.6248 8.3282 37.6248 6.06369 35.5417C4.81789 34.3958 3.95918 32.8763 3.61064 31.2011C2.97709 28.1561 5.08906 24.419 9.31299 16.9449Z" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <path d="M20.986 27.9998H21.0017" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 22.7498V15.7498" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

AlertIcon.displayName = 'AlertIcon';

export default AlertIcon;
