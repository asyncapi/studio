// VisualEditor.tsx 
import React, { useState, useEffect } from 'react';
import SchemaObject from './SchemaObject';

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
    try {
      const parsedSchema = JSON.parse(schema);
      setSchemaObject(parsedSchema);
    } catch (e) {
      console.error('Invalid JSON schema:', e);
    }
  }, [schema]);

const handleSchemaChange = (path, newSchemaPart) => {
    let updatedSchema = JSON.parse(JSON.stringify(schemaObject)); // Deep clone for immutability

    // Split the path, filtering out any empty segments to avoid issues with leading dots
    const pathParts = path.split('.').filter(Boolean);

    // Initialize a variable to track the current position as we navigate the schema
    let current = updatedSchema;

    // Iterate over the path parts to navigate to the correct location in the schema
    for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i];

        // When we're not at the last part, navigate or initialize the path as needed
        if (i < pathParts.length - 1) {
            // If navigating into 'properties', ensure it exists
            if (part === 'properties' && !current[part]) {
                current[part] = {};
            }
            current = current[part];
        } else {
            // For the final part, update with the new schema part
            // This assumes the last part of the path is always meant to be within 'properties'
            if (!current.properties) current.properties = {};
            current.properties[part] = newSchemaPart;
        }
    }

    // Update the state and trigger the change notification
    setSchemaObject(updatedSchema);
    onSchemaChange(JSON.stringify(updatedSchema, null, 2));
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

      {/*  */}
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
