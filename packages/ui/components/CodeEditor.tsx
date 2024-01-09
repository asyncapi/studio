// CodeEditor.tsx
import React, { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';

export const CodeEditor = ({ schema, onSchemaChange }) => {
    const [value, setValue] = useState(schema);
    const [error, setError] = useState('');

    useEffect(() => {
        setValue(schema);
    }, [schema]);

    const handleChange = debounce((newValue) => {
        try {
            JSON.parse(newValue);
            setError('');
            onSchemaChange(newValue);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            }
        }
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