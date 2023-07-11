'use client';

import { Provider as ModalsProvider } from '@ebay/nice-modal-react';

export default function Wrapper({
  children,
}: {
  children: React.ReactNode
}) {
  // This is the default wrapper around the whole layout. 
  // Put everything out here that you wish to hoist to the root of the app.
  return (
    <ModalsProvider>
      {children}
    </ModalsProvider>
  )
}