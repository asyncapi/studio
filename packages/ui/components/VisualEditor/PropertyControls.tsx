import React, { useState } from 'react';
import _ from 'lodash';
import { DropdownMenu, DropdownMenuItem } from '../DropdownMenu';

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
  const [error, setError] = useState('');
  const [showInputs, setShowInputs] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['Select Type']);
  const [selectedItemTypes, setSelectedItemTypes] = useState<string[]>(['Select Item Type']);

  const handleAddProperty = () => {
    if (_.isEmpty(key) || selectedTypes[0] === 'Select Type') {
      setError('Both property name and type are required.');
      return;
    }

    const fullPath = schemaPath ? `${schemaPath}.properties.${key}` : `properties.${key}`;
    console.log('Full Full Path :)', fullPath);
    console.log(`Adding new property at: ${fullPath}`);

    const newProperty = {
      type: selectedTypes.length === 1 ? selectedTypes[0] : selectedTypes,
      ...(selectedTypes.includes('object') && { properties: {} }),
      ...(selectedTypes.includes('array') && {
        items: {
          type: selectedItemTypes.length === 1 ? selectedItemTypes[0] : selectedItemTypes,
        },
      }),
    };

    onAdd(fullPath, newProperty as any);

    setKey('');
    setSelectedTypes(['Select Type']);
    setSelectedItemTypes(['Select Item Type']);
    setError('');
    setShowInputs(false);
  };

  const handleCancel = () => {
    setKey('');
    setSelectedTypes(['Select Type']);
    setSelectedItemTypes(['Select Item Type']);
    setError('');
    setShowInputs(false);
  };

  const typeOptions: DropdownMenuItem[] = [
    { title: 'Select Type',onSelect: () => {}},
    { type: 'separator'},
    { type: 'regular', title: 'String', onSelect: () => setSelectedTypes(['string']) },
    { type: 'regular', title: 'Number', onSelect: () => setSelectedTypes(['number']) },
    { type: 'regular', title: 'Boolean', onSelect: () => setSelectedTypes(['boolean']) },
    { type: 'regular', title: 'Object', onSelect: () => setSelectedTypes(['object']) },
    { type: 'regular', title: 'Array', onSelect: () => setSelectedTypes(['array']) },
  ];

  const itemTypeOptions: DropdownMenuItem[] = [
    { title: 'Select Item Type',onSelect: () => {}},
    { type: 'separator'},
    { type: 'regular', title: 'String', onSelect: () => setSelectedItemTypes(['string']) },
    { type: 'regular', title: 'Number', onSelect: () => setSelectedItemTypes(['number']) },
    { type: 'regular', title: 'Boolean', onSelect: () => setSelectedItemTypes(['boolean']) },
    { type: 'regular', title: 'Object', onSelect: () => setSelectedItemTypes(['object']) },
  ];

  return (
    <div className="">
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginLeft: `${level === 0 ? 20 : level * 20}px`,
        color: '#CBD5E1',
        fontFamily: 'Inter, sans-serif',
        borderLeft: '1px solid grey',
        marginTop: '-1px',
      }}>
        <div
          style={{
            borderTop: '1px solid grey',
            width: `${level === 0 ? 20 : level * 20}px`,
          }}
        />
          {!showInputs && (
              <button onClick={() => setShowInputs(true)} className='text-[#808080] px-2 py-2 rounded-md flex items-center gap-2 font-inter text-sm'>
              <div className="text-[#808080] border-2 border-[#808080] h-5 w-5 rounded-full flex items-center justify-center">
              <span>&#43;</span>
              </div>
              Add Property
              </button>
          )}
          {showInputs && (
            <div className='flex gap-[6px] items-center mt-[6px] mb-[6px]'>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Property name"
              style={{...inputAndSelectStyle, width: '130px' }}
            />

            <DropdownMenu
              trigger={<button style={{ ...inputAndSelectStyle, whiteSpace: 'nowrap'}}>{selectedTypes}</button>}
              items={typeOptions}
              multiple
              selectedOptions={selectedTypes}
              onSelect={(options) => setSelectedTypes(options)}
            />
            
            {selectedTypes.includes('array') && (
              <DropdownMenu
                trigger={<button style={{ ...inputAndSelectStyle, whiteSpace: 'nowrap'}}>{selectedItemTypes}</button>}
                items={itemTypeOptions}
                multiple
                selectedOptions={selectedItemTypes}
                onSelect={(options) => setSelectedItemTypes(options)}
              />
            )}
          <button onClick={handleAddProperty} className='inline-flex items-center justify-center px-2 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500'>Add</button>
          <button onClick={handleCancel} className="inline-flex items-center justify-center px-2 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">Cancel</button>
        </div>
        )}
      </div>
      <div className="">
          {error && <p style={{ color: '#DB2777' }}>{error}</p>}
      </div>
    </div>
  );  
};

export default PropertyControls;
