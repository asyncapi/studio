// VisualEditor.tsx
import React, { useState, useEffect } from 'react';
import SchemaObject from './SchemaObject';
import _ from 'lodash';

interface VisualEditorProps {
    schema: string;
    onSchemaChange: (newSchema: string) => void;
}

interface SchemaObjectInterface {
    type?: string;
    items?: any;
    properties?: { [key: string]: any };
    required?: string[];
}

export const VisualEditor: React.FC<VisualEditorProps> = ({ schema, onSchemaChange }) => {
  const selectStyle = {
    backgroundColor: '#0F172A',
    color: 'white',
    borderRadius: '3px',
    fontSize: '12px',
    fontFamily: 'Inter, sans-serif'
  };
  
  const [schemaObject, setSchemaObject] = useState<SchemaObjectInterface>({});

  useEffect(() => {
    const safeParse = _.attempt(JSON.parse, schema);
    if (!_.isError(safeParse)) {
      console.log('Successfully parsed schema.');
      setSchemaObject(safeParse);
    } else {
      console.error('Invalid JSON schema:', safeParse.message);
    }
  }, [schema]);

const handleSchemaChange = (newSchema) => {
    console.log('Schema updated:', newSchema);
    setSchemaObject(JSON.parse(newSchema));
    onSchemaChange(newSchema);
};


  const renderRootTypeSelector = () => (
    <div>
      <select
        value={schemaObject.type || ''}
        onChange={(e) => handleSchemaChange('', { type: e.target.value })}
        style={selectStyle}
      >
        <option value="">Select root type</option>
        <option value="object">Object</option>
        <option value="array">Array</option>
        <option value="string">String</option>
        <option value="number">Number</option>
        <option value="boolean">Boolean</option>
      </select>
    </div>
  );

  const renderArrayItemTypeSelector = () => {
    if (schemaObject.type === 'array') {
      return (
        <div>
          <strong>Array Item Type:</strong>
          <select
            value={schemaObject.items?.type || ''}
            onChange={(e) => handleSchemaChange('items', { type: e.target.value })}
            style={selectStyle}
          >
            <option value="">Select item type</option>
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
            <option value="object">Object</option>
            <option value="array">Array</option>
          </select>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="visual-editor" style={{background: '#0F172A', color: '#CBD5E1', fontFamily: 'Inter, sans-serif', padding: '20px'}}>
      {renderRootTypeSelector()}
      {renderArrayItemTypeSelector()}

      <SchemaObject
        schema={schemaObject.type === 'array' ? schemaObject.items : schemaObject}
        onSchemaChange={handleSchemaChange}
        path={schemaObject.type === 'array' ? "items" : ""}
        level={0}
      />
    </div>
  );
};

export default VisualEditor;