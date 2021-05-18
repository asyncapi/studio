import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import "@asyncapi/react-component/styles/default.min.css";

const AsyncAPIUI = dynamic(() => import('@asyncapi/react-component/browser'), { ssr: false });

export default function Preview ({ code, onError = () => {}, onContentChange = () => {} }) {
  // Render on the browser only
  if (typeof navigator === 'undefined') return null;

  useEffect(() => {
    onContentChange();
  }, [code, onContentChange]);

  return code && <AsyncAPIUI schema={code} />;
}
