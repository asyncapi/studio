import { Metadata } from 'next';
import ogImage from '@/img/meta-studio-og-image.jpeg';
import StudioEditor from '@/components/StudioEditor';

export const metadata: Metadata = {
  metadataBase: new URL('https://studio-next.netlify.app'),
  openGraph: {
    type: 'website',
    title: 'AsyncAPI Studio',
    description: 'Studio for AsyncAPI specification, where you can validate, view preview documentation, and generate templates from AsyncAPI document.',
    url: 'https://studio-next.netlify.app',
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
    <StudioEditor />
  )
}
