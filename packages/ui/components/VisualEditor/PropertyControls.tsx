import React, { useState } from 'react';
import _ from 'lodash';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../DropdownMenu';
import { AddIcon } from '../icons';

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

  const typeOptions = [
    { title: 'String', onSelect: () => setSelectedTypes(['string']) },
    { title: 'Number', onSelect: () => setSelectedTypes(['number']) },
    { title: 'Boolean', onSelect: () => setSelectedTypes(['boolean']) },
    { title: 'Object', onSelect: () => setSelectedTypes(['object']) },
    { title: 'Array', onSelect: () => setSelectedTypes(['array']) },
  ];

  const itemTypeOptions = [
    { title: 'String', onSelect: () => setSelectedItemTypes(['string']) },
    { title: 'Number', onSelect: () => setSelectedItemTypes(['number']) },
    { title: 'Boolean', onSelect: () => setSelectedItemTypes(['boolean']) },
    { title: 'Object', onSelect: () => setSelectedItemTypes(['object']) },
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
              <div className="text-[#808080] h-5 w-5 rounded-full flex items-center justify-center font-bold">
                <AddIcon className='font-bold' />
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

            <DropdownMenu>
              <DropdownMenuTrigger>
                <button style={{ ...inputAndSelectStyle, whiteSpace: 'nowrap'}}>{selectedTypes}</button>
              </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Select Type</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {typeOptions.map((menuItem) => (<DropdownMenuItem key={menuItem.title} onSelect={menuItem.onSelect}>{menuItem.title}</DropdownMenuItem>))}
                </DropdownMenuContent>
            </DropdownMenu>
            {selectedTypes.includes('array') && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <button style={{ ...inputAndSelectStyle, whiteSpace: 'nowrap'}}>{selectedItemTypes}</button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Select Item Type</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {itemTypeOptions.map((menuItem) => (<DropdownMenuItem key={menuItem.title} onSelect={menuItem.onSelect}>{menuItem.title}</DropdownMenuItem>))}
                </DropdownMenuContent>
              </DropdownMenu>
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
