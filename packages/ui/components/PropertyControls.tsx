// PropertyControls.tsx
import React, { useState } from 'react';

interface PropertyControlsProps {
    onAdd: (path: string, property: { name: string; schema: any }) => void;
    onRemove?: (path: string, propertyName: string) => void;
    onToggleRequired?: (path: string, propertyName: string) => void;
    requiredFields?: any;
    schemaPath?: string;
    level: number;
}

interface PropertySchema {
    type: string;
    items?: { type: string };
    properties?: Record<string, any>;
}

const PropertyControls: React.FC<PropertyControlsProps> = ({ onAdd, schemaPath, level }) => {
  const inputAndSelectStyle = {
    backgroundColor: '#0F172A',
    color: 'white',
    borderRadius: '3px',
    padding: '2px',
    fontSize: '14px',
    fontFamily: 'Inter, Helvetica'
  };

  const [key, setKey] = useState('');
  const [type, setType] = useState('');
  const [error, setError] = useState('');
  const [itemType, setItemType] = useState('');

  const handleAddProperty = () => {
    console.log(`handleAddProperty called with key: ${key}, type: ${type}, itemType: ${itemType}`);
    if (!key) {
        setError('Property name is required.');
        return;
    }
    if (!type) {
        setError('Property type is required.');
        return;
    }

    let propertySchema = type; // Initialize as an object with a type property

    // If the type is 'object', add an empty 'properties' object
    if (type === 'object') {
        let propertySchema={'type':type}; 
        propertySchema.properties = {};
    }
    // If the type is 'array', add 'items' with the specified or default itemType
    else if (type === 'array') {
        let propertySchema = {type};
        propertySchema.items = { 'type': itemType };
    }

    // Construct the full path correctly, incorporating 'properties' for nested properties
    const fullPath = schemaPath ? `${schemaPath}.${key}` : `${key}`; 
    console.log(`Adding new property at fullPath: ${fullPath}`);

    onAdd(fullPath, propertySchema); // Pass the correctly structured schema

    setKey('');
    setType('');
    setItemType('');
    setError('');
};


  return (
    <div style={{
      marginLeft: `${level * 20}px`,
      color: '#CBD5E1',
      fontFamily: 'Inter, sans-serif',
      borderLeft: '1px solid grey',
      paddingLeft: '10px',
      marginTop: '-1px'
    }}>
      <div className="flex gap-[6px] items-center mt-[6px] mb-[6px]">
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Property name"
          style={inputAndSelectStyle}
        />
        <select value={type} onChange={(e) => setType(e.target.value)} style={inputAndSelectStyle}>
          <option value="">Select type</option>
          <option value="string">String</option>
          <option value="number">Number</option>
          <option value="boolean">Boolean</option>
          <option value="object">Object</option>
          <option value="array">Array</option>
        </select>
        {type === 'array' && (
          <select value={itemType} onChange={(e) => setItemType(e.target.value)} style={inputAndSelectStyle}>
            <option value="">Select item type</option>
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
            <option value="object">Object</option>
          </select>
        )}
        <button onClick={handleAddProperty}>Add Property</button>
      </div>
      {error && <p style={{ color: '#DB2777' }}>{error}</p>}
    </div>
  );
};

export default PropertyControls;
