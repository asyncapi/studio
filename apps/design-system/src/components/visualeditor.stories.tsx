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

export const WithTabSwitching = () => {
  const [activeSystem, setActiveSystem] = useState('vis');
  const [schema, setSchema] = useState('{}'); // Initialize with an empty JSON object

  const handleSchemaChange = (newSchema) => {
    setSchema(newSchema);
  };

  const handleSystemClick = (systemKey) => {
    setActiveSystem(systemKey);
  };

  return (
    <div className="flex flex-col mx-auto p-4">
      <div className="flex justify-between mb-4">
        <button
          className={`p-2 rounded-md border border-gray-300 ${
            activeSystem === 'vis' ? 'bg-gray-200' : ''
          }`}
          onClick={() => handleSystemClick('vis')}
        >
          Visual
        </button>
        <button
          className={`p-2 rounded-md border border-gray-300 ${
            activeSystem === 'code' ? 'bg-gray-200' : ''
          }`}
          onClick={() => handleSystemClick('code')}
        >
          Code
        </button>
        <button
          className={`p-2 rounded-md border border-gray-300 ${
            activeSystem === 'ex' ? 'bg-gray-200' : ''
          }`}
          onClick={() => handleSystemClick('ex')}
        >
          Examples
        </button>
      </div>
      {activeSystem === 'vis' && <VisualEditor schema={schema} onSchemaChange={handleSchemaChange} />}
      {activeSystem === 'code' && <CodeEditor schema={schema} onSchemaChange={handleSchemaChange} />}
      {activeSystem === 'ex' && <Examples />}
    </div>
  );
};
