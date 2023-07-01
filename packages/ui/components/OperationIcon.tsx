import { FunctionComponent, SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  operation: 'send' | 'receive' | 'reply';
}

export const OperationIcon: FunctionComponent<IconProps> = ({ operation, className = "w-7 h-7", ...props }) => {
  switch (operation) {
    case "send":
      return (
        <svg {...props} className={className} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="28" height="28" rx="3" fill="#E0F2FE" />
          <path d="M8.375 19.625L19.625 8.375M19.625 8.375L11.1875 8.375M19.625 8.375V16.8125" stroke="#075985" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "receive":
      return (
        <svg {...props} className={className} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="28" height="28" rx="3" fill="#ECFCCB" />
          <path d="M19.625 8.375L8.375 19.625M8.375 19.625L16.8125 19.625M8.375 19.625L8.375 11.1875" stroke="#3F6212" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "reply":
      return (
        <svg {...props} className={className} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="28" height="28" rx="3" fill="#EDE9FE" />
          <path d="M11.75 11.75L7.25 16.25M7.25 16.25L11.75 20.75M7.25 16.25H16.25C18.7353 16.25 20.75 14.2353 20.75 11.75C20.75 9.26472 18.7353 7.25 16.25 7.25H14" stroke="#5B21B6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
};
