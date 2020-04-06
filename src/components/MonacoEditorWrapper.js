import { useEffect } from 'react'
import { monaco, ControlledEditor as MonacoEditor } from '@monaco-editor/react'
import { debounce } from 'lodash'

export default function MonacoEditorWrapper (props) {
  // Render on the browser only
  if (typeof navigator === 'undefined') return null

  useEffect(() => {
    monaco
      .init()
      .then(monacoInstance => {
        monacoInstance.editor.defineTheme('asyncapi-theme', {
          base: 'vs-dark',
          inherit: true,
          rules: [],
          colors: {
            'editor.background': '#252f3f',
          },
        });
      })
      .catch(console.error);
  }, []);

  return (
    <MonacoEditor
      {...props}
      onChange={debounce(props.onChange, 500)}
    />
  )
}
