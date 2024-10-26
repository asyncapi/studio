import dynamic from 'next/dynamic';
const StudioWrapper = dynamic(() => import('@/components/StudioWrapper'), {ssr: false})
import { Metadata } from 'next';

const description = 'Studio for AsyncAPI specification, where you can validate, view preview documentation, and generate templates from AsyncAPI document.';
const title = 'AsyncAPI Studio';
const url = 'https://studio.asyncapi.com/';

export const metadata : Metadata = {
  title,
  description,
  metadataBase: new URL(url),
  themeColor: '#000000',
  openGraph: {
    type: 'website',
    url,
    title,
    description,
    images: [
      {
        url: '/img/meta-studio-og-image.jpeg',
        width: 1200,
        height: 630,
        alt: 'AsyncAPI Studio preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@AsyncAPISpec',
    title,
    description:
      'Studio for AsyncAPI specification, where you can validate, view preview documentation, and generate templates from AsyncAPI document.',
    images: ['/img/meta-studio-og-image.jpeg'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon-194x194.png',
  },
};

export default async function Home() {
  return (
    <StudioWrapper />
  )
}
