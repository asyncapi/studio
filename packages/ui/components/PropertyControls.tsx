import React, { useState } from 'react';
import _ from 'lodash';

interface PropertyControlsProps {
    onAdd: (path: string, property: { name: string; schema: any }) => void;
    schemaPath?: string;
    level: number;
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
  if (_.isEmpty(key) || _.isEmpty(type)) {
      setError("Both property name and type are required.");
      return;
  }

  let fullPath = schemaPath ? `${schemaPath}.properties.${key}` : `properties.${key}`;
  console.log("Full Full Path :)", fullPath);
  console.log(`Adding new property at: ${fullPath}`);

  onAdd(fullPath, {
    type, 
    ...(type === 'object' && { properties: {} }), 
    ...(type === 'array' && { items: { type: itemType } }) 
  } as any); 

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
