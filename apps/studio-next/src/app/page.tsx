import dynamic from 'next/dynamic';
const StudioWrapper = dynamic(() => import('@/components/StudioWrapper'), {ssr: false})
import { Metadata } from 'next';
import ogImage from '@/img/meta-studio-og-image.jpeg';

export const metadata: Metadata = {
  metadataBase: new URL('https://studio-helios2003.netlify.app/'),
  openGraph: {
    type: 'website',
    title: 'AsyncAPI Studio',
    description: 'Studio for AsyncAPI specification, where you can validate, view preview documentation, and generate templates from AsyncAPI document.',
    url: 'https://studio-helios2003.netlify.app/',
    images: [
      {
        url: ogImage.src,
        width: 800,
        height: 600,
        alt: 'AsyncAPI default image',
      },
    ]
  },
  twitter: {
    site: '@AsyncAPISpec',
  }
}
export default async function Home() {
  return (
    <StudioWrapper />
  )
}
