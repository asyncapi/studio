import { useEffect, useRef } from 'react'

export default function Preview ({ code }) {
  // Render on the browser only
  if (typeof navigator === 'undefined') return null

  let iframe
  const didMountRef = useRef(false)
  useEffect(() => {
    if (didMountRef.current) sendContent()
    else didMountRef.current = true
  })

  const sendContent = () => {
    iframe.contentWindow.postMessage({
      eventName: 'content',
      content: code,
    }, '*')
  }

  return (
    <iframe
      style={{width: '100%', height: '100%', border: 'none', backgroundColor: 'white'}}
      src="/html/template/"
      ref={obj => { iframe = obj }}
      onLoad={() => sendContent()}
    />
  )
}
