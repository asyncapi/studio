import React, { useState } from 'react';
import { VisualEditor, CodeEditor, Examples } from '@asyncapi/studio-ui';

const meta = {
  component: VisualEditor,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light'
    }
  },
};

export default meta;

const EditorToggle = ({ schema, onSchemaChange }) => {
  const [activeSystem, setActiveSystem] = useState('vis');

  const handleSystemClick = (systemKey) => {
    setActiveSystem(systemKey);
  };

  return (
    <div className="flex flex-col mx-auto p-4">
      <div className="flex justify-between mb-4">
        <button className={`p-2 rounded-md border border-gray-300 ${activeSystem === 'vis' ? 'bg-gray-200' : ''}`} onClick={() => handleSystemClick('vis')}>
          Visual
        </button>
        <button className={`p-2 rounded-md border border-gray-300 ${activeSystem === 'code' ? 'bg-gray-200' : ''}`} onClick={() => handleSystemClick('code')}>
          Code
        </button>
        <button className={`p-2 rounded-md border border-gray-300 ${activeSystem === 'ex' ? 'bg-gray-200' : ''}`} onClick={() => handleSystemClick('ex')}>
          Examples
        </button>
      </div>
      {activeSystem === 'vis' && <VisualEditor schema={schema} onSchemaChange={onSchemaChange} />}
      {activeSystem === 'code' && <CodeEditor schema={schema} onSchemaChange={onSchemaChange} />}
      {activeSystem === 'ex' && <Examples />}
    </div>
  );
};

export const DefaultSchema = () => {
  const [schema, setSchema] = useState('{}');

  return <EditorToggle schema={schema} onSchemaChange={setSchema} />;
};

export const WithCustomSchema = () => {
  const customSchema = JSON.stringify({
    type: "object",
    properties: {
      firstName: {
        type: "string"
      },
      lastName: {
        type: "string"
      },
      age: {
        type: "boolean"
      },
      height: {
        type: ["integer", "null"]
      },
      friends: {
        type: "array",
        items: {
          type: "object",
          properties: {
            firstName: {
              type: "string"
            }
          }
        }
      }
    },
    required: ["firstName", "lastName"]
  }, null, 2);

  const [schema, setSchema] = useState(customSchema);

  return <EditorToggle schema={schema} onSchemaChange={setSchema} />;
};
