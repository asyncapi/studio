import React, { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';

interface CodeEditorProps {
  schema: string;
  onSchemaChange: (newSchema: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ schema, onSchemaChange }) => {
  const [value, setValue] = useState<string>(schema);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setValue(schema); // Update local state when schema prop updates
  }, [schema]);

  // Debounced handleChange to optimize performance
  const handleChange = debounce((newValue: string) => {
    try {
      // Attempt to parse the new JSON value to validate it
      JSON.parse(newValue);
      setError(''); // Clear any existing error
      onSchemaChange(newValue); // Propagate valid schema changes
      console.log('Schema valid and updated from Code Editor:', newValue);
    } catch (e) {
      if (e instanceof Error) {
        setError(`Invalid JSON: ${e.message}`); // Set error state to the message of the exception
        console.error('Error updating schema from Code Editor:', e.message);
      }
    }
  }, 250);

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue); // Update local state immediately for user feedback
    handleChange(newValue); // Debounced call to handle actual schema validation and update
  };

  return (
    <div className="code-editor">
      <h2>Code Editor</h2>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <textarea
        value={value}
        onChange={handleTextAreaChange}
        style={{ width: '100%', height: '400px' }} // Adjusted for better usability
      />
    </div>
  );
};

export default CodeEditor;
