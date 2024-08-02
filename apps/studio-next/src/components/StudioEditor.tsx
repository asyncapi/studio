'use client'
import dynamic from 'next/dynamic'
const StudioWrapper = dynamic(() => import('@/components/StudioWrapper'), {ssr: false})

/*
Calling StudioWrapper as Code Splitting in Server Components will also make them be included in server-side rendering,
that's why we added another layer and told them as client components to make the code splitting work in client-side only

Related Issue: https://github.com/asyncapi/studio/issues/1118
Reference: https://github.com/vercel/next.js/issues/49454#issuecomment-1830053413
*/
export default async function StudioEditor() {
  return (
    <StudioWrapper />
  )
}
