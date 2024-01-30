import React, { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';

// Define types for the props
interface CodeEditorProps {
    schema: string;
    onSchemaChange: (newSchema: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ schema, onSchemaChange }) => {
    const [value, setValue] = useState<string>(schema);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        setValue(schema);
    }, [schema]);

    const handleChange = debounce((newValue: string) => {
        try {
            JSON.parse(newValue);
            setError('');
            onSchemaChange(newValue);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            }
        }
        console.log('Schema updated from Code Editor:', newValue);
    }, 250);

    return (
        <div className="code-editor">
            <h2>Code Editor</h2>
            {error && <p>Error: {error}</p>}
            <textarea
                value={value}
                onChange={(e) => handleChange(e.target.value)}
            />
        </div>
    );
};

export default CodeEditor;