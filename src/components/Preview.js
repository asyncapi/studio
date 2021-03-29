import { useEffect, useState } from 'react'
import { AsyncAPIDocument } from '@asyncapi/parser';
import AsyncAPIComponent from '@asyncapi/react-component';

export default function Preview ({ code, onError = () => {}, onContentChange = () => {} }) {
  // Render on the browser only
  if (typeof navigator === 'undefined') return null;

  const [parsedSchema, setParsedSchema] = useState(null);

  useEffect(() => {
    fetch('/spec/parse', {
      method: 'POST',
      body: code,
    })
    .then(async res => {
      if (res.ok) {
        const data = await res.json();
        const document = new AsyncAPIDocument(data);
        setParsedSchema(document);
        onContentChange({ parsedSchema: data });
      } else {
        const err = await res.json();
        onError(err);
      }
    })
    .catch(console.error);
  }, [code]);

  return parsedSchema && (
    <AsyncAPIComponent schema={parsedSchema} />
  );
}
