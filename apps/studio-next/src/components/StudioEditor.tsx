'use client'
import dynamic from 'next/dynamic'
const StudioWrapper = dynamic(() => import('@/components/StudioWrapper'), {ssr: false})

/*
Calling next/dynamic with client component in server component is so far not able to do code splitting. 
So we move them to a here as client component and call next/dynamic here to enable code splitting.

Using next/dynamic in server components will also be including in server side rendering 
which will contribute to cold start and huge bundle size.
https://github.com/vercel/next.js/issues/49454#issuecomment-1830053413
*/
export default async function StudioEditor() {
  return (
    <StudioWrapper />
  )
}
