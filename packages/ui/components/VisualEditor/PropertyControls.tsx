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
    borderRadius: '3px',
    padding: '2px',
    fontSize: '14px',
    fontFamily: 'Inter, Helvetica',
  };

  const [key, setKey] = useState('');
  const [type, setType] = useState('');
  const [error, setError] = useState('');
  const [itemType, setItemType] = useState('');
  const [showInputs, setShowInputs] = useState(false);

  const handleAddProperty = () => {
    if (_.isEmpty(key) || _.isEmpty(type)) {
      setError('Both property name and type are required.');
      return;
    }

    const fullPath = schemaPath ? `${schemaPath}.properties.${key}` : `properties.${key}`;
    console.log('Full Full Path :)', fullPath);
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
    setShowInputs(false);
  };

  const handleCancel = () => {
    setKey('');
    setType('');
    setItemType('');
    setError('');
    setShowInputs(false);
  };

  return (
    <div style={{
      marginLeft: `${level === 0 ? 20 : level * 20}px`,
      color: '#CBD5E1',
      fontFamily: 'Inter, sans-serif',
      borderLeft: '1px solid grey',
      paddingLeft: '10px',
      marginTop: '-1px',
    }}>
        {!showInputs && (
          <div>
            <button onClick={() => setShowInputs(true)} className='text-[#808080] px-3 py-2 rounded-md flex items-center gap-2 font-inter text-sm'>
            <div className="text-[#808080] border-2 border-[#808080] h-5 w-5 rounded-full flex items-center justify-center">
            <span>&#43;</span>
            </div>
            Add Property
            </button>
          </div>
        )}
        {showInputs && (
          <div className='flex gap-[6px] items-center mt-[6px] mb-[6px]'>
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
        <button onClick={handleAddProperty}>Add</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
        )}
      {error && <p style={{ color: '#DB2777' }}>{error}</p>}
    </div>
  );
};

export default PropertyControls;
