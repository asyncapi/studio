import { useEffect } from 'react';
import dynamic from 'next/dynamic';

export default function Preview ({ code, onError = () => {}, onContentChange = () => {} }) {
  // Render on the browser only
  if (typeof navigator === 'undefined') return null;
  const AsyncAPIUI = dynamic(() => import('@asyncapi/react-component/bundles/umd'));

  useEffect(() => {
    onContentChange();
  }, [code, onContentChange]);

  return code && <AsyncAPIUI schema={code} />;
}
