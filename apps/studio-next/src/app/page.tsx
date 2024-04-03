import Preloader from '@/components/Preloader';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
const StudioWrapper = dynamic(()=> import('@/components/StudioWrapper'), {ssr: false})
export default async function Home() {
  return (
    <StudioWrapper />
  )
}
