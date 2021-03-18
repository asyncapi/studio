import { useEffect, useRef, useState } from 'react'
import { AsyncAPIDocument } from '@asyncapi/parser';
import AsyncAPIComponent from '@asyncapi/react-component';

export default function Preview ({ code, onError = () => {}, onContentChange = () => {} }) {
  // Render on the browser only
  if (typeof navigator === 'undefined') return null

  const [parsedSchema, setParsedSchema] = useState(null);
  const [isListeningEvents, setIsListeningEvents] = useState(false)

  let iframe;
  const didMountRef = useRef(false)
  useEffect(() => {
    // if (!isListeningEvents) {
    //   iframe.contentWindow.addEventListener('parsingError', errorEventListener)
    //   iframe.contentWindow.addEventListener('content', contentEventListener)
    //   setIsListeningEvents(true)
    // }
    // if (didMountRef.current) sendContent()
    // else didMountRef.current = true
  }, [code])

  useEffect(() => {
    fetch('/parser', {
      method: 'POST',
      body: code,
    })
    .then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        const document = new AsyncAPIDocument(data);
        setParsedSchema(document);
      } else {
        const data = await res.json();
        console.log(data);
      }
    })
    .catch(console.error)
  }, [code])

  function errorEventListener (error) {
    onError(error.detail)
  }

  function contentEventListener (ev) {
    onContentChange(ev.detail)
  }

  const sendContent = () => {
    iframe.contentWindow.postMessage({
      eventName: 'content',
      content: code,
    }, '*')
  }

  return parsedSchema && (
    // <iframe
    //   style={{width: '100%', height: '100%', border: 'none', backgroundColor: 'white'}}
    //   src="/html/template/"
    //   ref={obj => { iframe = obj }}
    //   onLoad={() => sendContent()}
    // />
    <AsyncAPIComponent schema={parsedSchema} />
  )
}
