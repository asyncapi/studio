import { Metadata } from 'next';

export const metadata : Metadata = {
  title: 'AsyncAPI Studio',
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon-194x194.png',
    other: [
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png'
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png'
      },
    ]
  },
  description:
    'Studio for AsyncAPI specification, where you can validate, view preview documentation, and generate templates from AsyncAPI document.',
  openGraph: {
    type: 'website',
    url: 'https://studio.asyncapi.com/',
    title: 'AsyncAPI Studio',
    description:
      'Studio for AsyncAPI specification, where you can validate, view preview documentation, and generate templates from AsyncAPI document.',
    images: [
      {
        url: '/img/meta-studio-og-image.jpeg',
        width: 1200,
        height: 630,
        alt: 'AsyncAPI Studio',
      },
    ],
  },
  twitter: {
    title: 'AsyncAPI Studio',
    site: '@AsyncAPISpec',
    card: 'summary_large_image',
    description: 'Studio for AsyncAPI specification, where you can validate, view preview documentation, and generate templates from AsyncAPI document.',
    images: [
      {
        url: '/img/meta-studio-og-image.jpeg',
        width: 1200,
        height: 630,
        alt: 'AsyncAPI Studio',
      },
    ],
  }
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* <Wrapper> */}
          {children}
        {/* </Wrapper> */}
      </body>
    </html>
  )
}
