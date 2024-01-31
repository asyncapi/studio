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

    let propertySchema: PropertySchema = { type };
    if (type === 'array') {
      propertySchema.items = { type: itemType || 'string' };
    } else if (type === 'object') {
      propertySchema.properties = {};
    }

    const newProperty = {
      name: key,
      schema: propertySchema
    };

    setKey('');
    setType('');
    setItemType('');
    setError('');

    
    
    const fullPath = schemaPath ? `${schemaPath}.${key}` : key;
    console.log(`Adding new property. Full Path: ${fullPath}, Property:`, newProperty);
  
    onAdd(fullPath, { name: key, schema: propertySchema });

  };

  return (
    <div style={{ marginLeft: `${level * 20}px` }} className="border-l border-extendedblue-gray800 pl-[10px]">
        <div className="flex gap-[6px] items-center mt-[6px] mb-[6px]">
            <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Property name"
                className="[font-family:'Inter',Helvetica] text-extendedblue-gray300 bg-extendedblue-gray800 border border-extendedblue-gray700 rounded-[3px] p-[2px] text-[12px]"
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
            {error && <p className="text-extendedred-700">{error}</p>}
        </div>
  );
};

export default PropertyControls;
