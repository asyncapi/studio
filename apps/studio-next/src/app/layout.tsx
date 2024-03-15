/* eslint-disable no-undef */
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Test Heading ',
  description: 'Test description. This will check the length of the description.',
  // Add og:image URL here
  image: 'https://example.com/path/to/your/image.jpg',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Add meta tags for social media sharing */}
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:image" content={metadata.image} />
        {/* You can add more meta tags as needed */}
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
