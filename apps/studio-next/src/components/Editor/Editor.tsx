'use client'

import { useFilesState } from '@/state/files.state';
import { CodeMirror } from './CodeMirror';

interface IEditorProps {}

export const Editor = (props: IEditorProps) => {
  const { language, content } = useFilesState(state => state.files['asyncapi']);
  const handleUpdateFile = useFilesState(state => state.updateFile);

  return (
    <div className="flex flex-1 overflow-hidden">
      <CodeMirror language={language} value={content} onChange={value => handleUpdateFile('asyncapi', { content: value })} />
    </div>
  );
}