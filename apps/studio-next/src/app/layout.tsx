/* eslint-disable no-undef */
import { Toolbar } from '@/components/Toolbar'

import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/shift-away.css';
import '@asyncapi/react-component/styles/default.min.css';
import 'reactflow/dist/style.css';
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Toolbar />
        <main className="flex flex-col w-full h-[calc(100vh-4rem)]">
          {children}
        </main> 
        <div id="preloader">
          <div className="text-center">
            <div>
              <img
                className="inline-block h-20"
                src={`${process.env.PUBLIC_URL || ''}/img/logo-studio.svg`}
                alt="AsyncAPI Logo"
              />
              <span className="inline-block text-xs text-teal-500 font-normal tracking-wider ml-1 transform translate-y-1.5 -translate-x-1 uppercase">
            beta
              </span>
            </div>
            <div className="w-full text-center h-8 -mt-2">
              <div className="rotating-wheel"></div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
