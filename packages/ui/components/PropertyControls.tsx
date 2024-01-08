// PropertyControls.tsx
import React, { useState } from 'react';

const PropertyControls = ({ onAdd, schemaPath, level }) => {
  const [key, setKey] = useState('');
  const [type, setType] = useState('');
  const [error, setError] = useState('');
  const [itemType, setItemType] = useState('');

  const handleAddProperty = () => {
    if (!key) {
      setError('Property name is required.');
      return;
    }
    if (!type) {
      setError('Property type is required.');
      return;
    }

    let propertySchema = { type };
    if (type === 'array') {
      propertySchema.items = { type: itemType || 'string' };
    }

    const newProperty = {
      name: key,
      schema: propertySchema
    };

    setKey('');
    setType('');
    setItemType('');
    setError('');

    onAdd(schemaPath, newProperty);
  };

  return (
    <div style={{ marginLeft: `${level * 20}px` }}>
      <div>
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Property name"
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Select type</option>
          <option value="string">String</option>
          <option value="number">Number</option>
          <option value="boolean">Boolean</option>
          <option value="object">Object</option>
          <option value="array">Array</option>
        </select>
        {type === 'array' && (
          <select value={itemType} onChange={(e) => setItemType(e.target.value)}>
            <option value="">Select item type</option>
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
            <option value="object">Object</option>
          </select>
        )}
        <button onClick={handleAddProperty}>Add Property</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default PropertyControls;
