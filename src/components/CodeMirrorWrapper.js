import { debounce } from 'lodash'

export default function CodeMirrorWrapper ({ code, onCodeChange = () => {} }) {
  // Render on the browser only
  if (typeof navigator === 'undefined') return null

  require('codemirror/mode/yaml/yaml')
  const { UnControlled: CodeMirror } = require('react-codemirror2')

  const options = {
    lineNumbers: true,
    lineWrapping: true,
    tabSize: 2,
    indentWithTabs: false,
    mode: 'text/yaml',
    className: 'w-full h-full',
    theme: 'material-palenight',
  }

  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/tonsky/FiraCode@1.206/distr/fira_code.css" />
      <style>{`
        .CodeMirror {
          height: 100%;
          width: 100%;
          font-size: 16px;
          font-family: 'Fira Code', monospace;
        }
      `}</style>
      <CodeMirror
        value={code}
        options={options}
        onChange={debounce(onCodeChange, 500)}
        className="w-full flex-1 overflow-auto"
      />
    </>
  )
}
