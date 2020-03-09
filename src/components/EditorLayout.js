import Head from 'next/head'
import Topbar from './Topbar'

export default function EditorLayout ({ children }) {
  return (
    <>
      <Head>
        <style>{`
          html, body, #__next {
            height: 100%;
          }
        `}</style>
      </Head>
      <div className="flex flex-col h-full w-full">
        <div className="w-full bg-gray-800">
          <Topbar active="editor" />
        </div>
        <main className="flex flex-col flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </>
  )
}
