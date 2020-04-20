import { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types';
import Editor, { monaco } from '@monaco-editor/react'
import { debounce } from 'lodash'
import { errorHasLocation, isValidationError, isUnsupportedVersionError, isJsonError, isYamlError, isDereferenceError } from './helpers/parse-asyncapi'

let editor
let Monaco

const setMarkersAndDecorations = (errors, decorations) => {
  const newDecorations = []

  errors.forEach(err => {
    const { title, detail, location } = err
    if (!location) {
      console.error('Error must have a `location` property.')
      return console.error(err)
    }
    const { startLine, startColumn, endLine, endColumn } = location

    const markerOptions = {
      startLineNumber: startLine,
      startColumn: startColumn,
      message: `${title}${detail ? '\n' + detail : ''}`,
    }

    if (typeof endLine === 'number') markerOptions.endLineNumber = endLine
    if (typeof endColumn === 'number') markerOptions.endColumn = endColumn

    Monaco.editor.setModelMarkers(editor.getModel(), 'test', [markerOptions])

    if (typeof endLine === 'number' && typeof endColumn === 'number') {
      newDecorations.push(
        { range: new Monaco.Range(startLine, startColumn, endLine, endColumn), options: { inlineClassName: 'bg-red-500-20' } }
      )
    }
  })

  return editor.deltaDecorations(decorations, newDecorations)
}

export default function MonacoEditorWrapper ({ language, theme, onChange, value, className, error, options, editorDidMount, ...props }) {
  // Render on the browser only
  if (typeof navigator === 'undefined') return null

  const previousValue = useRef(value);
  const [decorations, setDecorations] = useState([])
  const debouncedOnChange = debounce(onChange, 500)

  const handleEditorDidMount = (getValue, ed) => {
    editor = ed
    setErrorMarkers()

    editor.onDidChangeModelContent(ev => {
      const currentValue = editor.getValue()
      if (currentValue !== previousValue.current) {
        previousValue.current = currentValue
        const value = debouncedOnChange(ev, currentValue)

        if (typeof value === 'string') {
          if (currentValue !== value) {
            editor.setValue(value)
          }
        }
      }
    });

    editorDidMount(getValue, editor)
  }

  useEffect(() => {
    monaco
      .init()
      .then(monacoInstance => {
        Monaco = monacoInstance
        monacoInstance.editor.defineTheme('asyncapi-theme', {
          base: 'vs-dark',
          inherit: true,
          rules: [],
          colors: {
            'editor.background': '#252f3f',
          },
        })
      })
      .catch(console.error)
  }, [])

  const setErrorMarkers = () => {
    if (!editor || !Monaco) return

    editor.deltaDecorations(decorations, [])
    Monaco.editor.setModelMarkers(editor.getModel(), 'test', [])

    if (errorHasLocation(error)) {
      let errors = []
      if (isValidationError(error) || isUnsupportedVersionError(error)) errors = error.validationErrors
      if (isYamlError(error) || isJsonError(error)) errors = [error]
      if (isDereferenceError(error)) errors = error.refs.map(ref => ({ title: error.title, location: { ...ref } }))

      setDecorations(setMarkersAndDecorations(errors, decorations))
    } else if (error) {
      const fullRange = editor.getModel().getFullModelRange()

      Monaco.editor.setModelMarkers(editor.getModel(), 'test', [{
        startLineNumber: fullRange.startLineNumber,
        startColumn: fullRange.startColumnNumber,
        endLineNumber: fullRange.endLineNumber,
        endColumn: fullRange.endColumnNumber,
        message: `${error.title}${error.detail ? '\n' + error.detail : ''}`,
      }])
      setDecorations(editor.deltaDecorations(decorations, [
        { range: editor.getModel().getFullModelRange(), options: { inlineClassName: 'bg-red-500-20' } }
      ]))
    }
  }

  useEffect(() => {
    setErrorMarkers()
  }, [error])

  return (
    <Editor
      editorDidMount={handleEditorDidMount}
      language={language}
      theme={theme}
      value={value}
      className={className}
      error={error}
      options={options}
      {...props}
    />
  )
}

MonacoEditorWrapper.propTypes = {
  value: PropTypes.string,
  editorDidMount: PropTypes.func,
  onChange: PropTypes.func,
};

MonacoEditorWrapper.defaultProps = {
  editorDidMount: () => {},
  onChange: () => {},
};
