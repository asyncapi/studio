import { useEffect, useState } from 'react'
import AsyncAPIComponent from '@asyncapi/react-component';

export default function Preview ({ code, onError = () => {}, onContentChange = () => {} }) {
  // Render on the browser only
  if (typeof navigator === 'undefined') return null;

  const [parsedSchema, setParsedSchema] = useState(null);

  useEffect(() => {
    AsyncAPIParser.parse(code)
      .then(spec => {
        const document = new AsyncAPIParser.AsyncAPIDocument(spec);
        setParsedSchema(document);
        onContentChange({ parsedSchema: spec });
      })
      .catch(err => {
        console.error(err);
        onError(err);
      });
  }, [code]);

  return parsedSchema && (
    <AsyncAPIComponent schema={parsedSchema} />
  );
}
