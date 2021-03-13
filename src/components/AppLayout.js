import Head from 'next/head'
import Topbar from './Topbar'

export default function AppLayout ({ title, children, page }) {
  return (
    <>
      <Head>
        <style>{`
          html, body, #__next {
            height: 100%;
          }
        `}</style>
        <title>{title ? `${title} | AsyncAPI Studio` : 'AsyncAPI Studio'}</title>
      </Head>
      <div className="flex flex-col">
        <header>
          <div className="bg-gray-800">
            <Topbar active={page} />
          </div>
        </header>
        <main className="flex flex-col overflow-auto justify-start py-8 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </>
  )
}
