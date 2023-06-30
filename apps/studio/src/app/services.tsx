'use client';

// import { use } from 'react';
// import { ServicesProvider, createServices } from '../services';
import { Provider as ModalsProvider } from '@ebay/nice-modal-react';

export default function Wrapper({
  children,
}: {
  children: React.ReactNode
}) {
  // const services = use(createServices());

  return (
      // <ServicesProvider value={services}>
        <ModalsProvider>
          {children}
        </ModalsProvider>
      // </ServicesProvider>
  )
}
