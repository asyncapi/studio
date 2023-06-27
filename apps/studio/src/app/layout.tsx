import { ServicesProvider, createServices } from '../services';
import { Provider as ModalsProvider } from '@ebay/nice-modal-react';

import './globals.css';
import './main.css';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/shift-away.css';
import '@asyncapi/react-component/styles/default.min.css';
import 'reactflow/dist/style.css';

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

function configureMonacoEnvironment() {
  window.MonacoEnvironment = {
    getWorker(_, label) {
      switch (label) {
      case 'editorWorkerService':
        return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url));
      case 'json':
        return new Worker(
          new URL('monaco-editor/esm/vs/language/json/json.worker', import.meta.url),
        );
      case 'yaml':
      case 'yml':
        return new Worker(new URL('monaco-yaml/yaml.worker', import.meta.url));
      default:
        throw new Error(`Unknown worker ${label}`);
      }
    },
  };
}


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const services = await createServices();
  configureMonacoEnvironment();

  return (
    <html lang="en">
      <body>
      <ServicesProvider value={services}>
        <ModalsProvider>
          {children}
        </ModalsProvider>
      </ServicesProvider>
      </body>
    </html>
  )
}
