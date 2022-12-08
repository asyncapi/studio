import { useEffect, useRef } from 'react';

import { useServices } from '../../services';

import type { FunctionComponent } from 'react';
import type { EditorProps as MonacoEditorProps } from '@monaco-editor/react';

export const MonacoWrapper: FunctionComponent<MonacoEditorProps> = (props) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const { editorSvc } = useServices();

  useEffect(() => {
    if (editorRef.current) {
      editorSvc.onSetupEditor(editorRef.current);
    }
  }, []);

  return (
    <div className='flex flex-row items-center justify-between w-full h-full'>
      <div 
        className='flex flex-row items-center justify-between w-full h-full'
        ref={editorRef} 
      />
    </div>
  );
};
