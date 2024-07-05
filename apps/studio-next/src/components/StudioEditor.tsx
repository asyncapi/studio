'use client'
import dynamic from 'next/dynamic'
const StudioWrapper = dynamic(() => import('@/components/StudioWrapper'), {ssr: false})


export default async function StudioEditor() {
  return (
    <StudioWrapper />
  )
}
