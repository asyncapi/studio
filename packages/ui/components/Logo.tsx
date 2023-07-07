import type { FunctionComponent } from 'react'

interface LogoProps {
  className: string
}

function LogoImage({
  className = ''
}) {
  return (
    <svg className={className} viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25.1709 33.6028H8.43181C6.19649 33.5997 4.0536 32.7104 2.47299 31.1298C0.892377 29.5492 0.00304997 27.4063 0 25.1709V8.43182C0.00304997 6.1965 0.892377 4.0536 2.47299 2.47299C4.0536 0.892377 6.19649 0.00304997 8.43181 0H25.1709C27.4065 0.00244118 29.5497 0.891577 31.1304 2.47232C32.7112 4.05307 33.6003 6.19631 33.6028 8.43182V25.1709C33.6003 27.4065 32.7112 29.5497 31.1304 31.1305C29.5497 32.7112 27.4065 33.6003 25.1709 33.6028ZM8.43181 1.84453C6.6855 1.84697 5.01142 2.54177 3.7766 3.7766C2.54177 5.01142 1.84697 6.68551 1.84453 8.43182V25.1709C1.84697 26.9173 2.54177 28.5913 3.7766 29.8262C5.01142 31.061 6.6855 31.7558 8.43181 31.7582H25.1709C26.9173 31.7558 28.5913 31.061 29.8262 29.8262C31.061 28.5913 31.7558 26.9173 31.7582 25.1709V8.43182C31.7558 6.68551 31.061 5.01142 29.8262 3.7766C28.5913 2.54177 26.9173 1.84697 25.1709 1.84453H8.43181Z" fill="url(#paint0_linear_303_636)"/>
      <path d="M11.1756 13.449L10.2302 14.7517L17.613 20.11L17.6614 20.1469L18.6067 18.8442L11.1756 13.449Z" fill="url(#paint1_linear_303_636)"/>
      <path d="M15.9483 13.449L15.003 14.7517L22.4364 20.1469L23.3818 18.8442L15.9483 13.449Z" fill="url(#paint2_linear_303_636)"/>
      <path d="M16.8083 6.78097C12.8057 6.78097 9.55006 9.26879 9.55006 12.3261V12.3883H11.164V12.3261C11.164 10.1565 13.7003 8.39032 16.8129 8.39032C19.9256 8.39032 22.4618 10.1565 22.4618 12.3261V12.3883H24.0758V12.3261C24.0665 9.26879 20.8109 6.78097 16.8083 6.78097Z" fill="url(#paint3_linear_303_636)"/>
      <path d="M22.4456 21.2767C22.4456 23.4463 19.9094 25.2125 16.7945 25.2125C13.6795 25.2125 11.1456 23.4463 11.1456 21.2767V21.2144H9.53161V21.2767C9.53161 24.334 12.7872 26.8218 16.7898 26.8218C20.7925 26.8218 24.0481 24.334 24.0481 21.2767V21.2144H22.4341L22.4456 21.2767Z" fill="url(#paint4_linear_303_636)"/>
      <defs>
        <linearGradient id="paint0_linear_303_636" x1="34" y1="-1.19783e-08" x2="1.19784e-08" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F7A7DB"/>
          <stop offset="1" stopColor="#DE1978"/>
        </linearGradient>
        <linearGradient id="paint1_linear_303_636" x1="34" y1="-1.19783e-08" x2="1.19784e-08" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F7A7DB"/>
          <stop offset="1" stopColor="#DE1978"/>
        </linearGradient>
        <linearGradient id="paint2_linear_303_636" x1="34" y1="-1.19783e-08" x2="1.19784e-08" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F7A7DB"/>
          <stop offset="1" stopColor="#DE1978"/>
        </linearGradient>
        <linearGradient id="paint3_linear_303_636" x1="34" y1="-1.19783e-08" x2="1.19784e-08" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F7A7DB"/>
          <stop offset="1" stopColor="#DE1978"/>
        </linearGradient>
        <linearGradient id="paint4_linear_303_636" x1="34" y1="-1.19783e-08" x2="1.19784e-08" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F7A7DB"/>
          <stop offset="1" stopColor="#DE1978"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

export const Logo: FunctionComponent<LogoProps> = ({
  className = ''
}) => {
  return (
    <LogoImage
      className={`inline-block ${className || 'h-16 w-32'}`}
    />
  )
}