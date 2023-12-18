import React, { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';


interface CodeEditorProps {
  schema: string;
  onSchemaChange: (newSchema: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ schema, onSchemaChange }) => {
  const [value, setValue] = useState(schema);
  const [error, setError] = useState('');

  // Update local state when the incoming schema changes
  useEffect(() => {
    setValue(schema);
  }, [schema]);

  // Debounced change handler to limit the number of updates
  const handleChange = debounce((newValue: string) => {
    try {
      JSON.parse(newValue); // Will throw an error if JSON is invalid
      setError('');
      onSchemaChange(newValue);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    }
  }, 250);

  // Handle text area change event
  const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    handleChange(newValue);
  };

  return (
    <div className="border border-gray-500 rounded p-4">
      <h2>Code Editor</h2>
      {error && <p className="text-red-500">Error: {error}</p>}
      <textarea
        className="w-full h-full rounded border border-gray-300"
        placeholder="Enter your JSON schema here"
        value={value}
        onChange={handleTextAreaChange}
      />
    </div>
  );
};

export default CodeEditor;
