import React, { useState, useEffect } from 'react';
import SchemaObject from './VisualEditor/SchemaObject';
import _ from 'lodash';
import { getColorForType } from './VisualEditor/SchemaProperty';
import { DropdownMenu, DropdownMenuItem } from './DropdownMenu';

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

  const handleSchemaChange = (updatedPart: any) => {
    const updatedSchema = { ...schemaObject, ...updatedPart };
    const newSchemaString = JSON.stringify(updatedSchema);
    console.log('Schema updated:', newSchemaString);
    setSchemaObject(updatedSchema);
    onSchemaChange(newSchemaString);
  };

  const handleRootTypeDropdownSelect = (selectedOption: string) => {
    handleSchemaChange({ type: selectedOption });
  };
  
  const handleArrayItemTypeDropdownSelect = (selectedOption: string) => {
    handleSchemaChange({ items: { ...schemaObject.items, type: selectedOption } });
  };

  const rootTypeOptions: DropdownMenuItem[] = [
    { type: 'regular', title: 'Object', onSelect: () => handleRootTypeDropdownSelect('object') },
    { type: 'regular', title: 'Array', onSelect: () => handleRootTypeDropdownSelect('array') },
    { type: 'regular', title: 'String', onSelect: () => handleRootTypeDropdownSelect('string') },
    { type: 'regular', title: 'Number', onSelect: () => handleRootTypeDropdownSelect('number') },
    { type: 'regular', title: 'Boolean', onSelect: () => handleRootTypeDropdownSelect('boolean') },
  ];
  
  const itemTypeOptions: DropdownMenuItem[] = [
    { type: 'regular', title: 'String', onSelect: () => handleArrayItemTypeDropdownSelect('string') },
    { type: 'regular', title: 'Number', onSelect: () => handleArrayItemTypeDropdownSelect('number') },
    { type: 'regular', title: 'Boolean', onSelect: () => handleArrayItemTypeDropdownSelect('boolean') },
    { type: 'regular', title: 'Object', onSelect: () => handleArrayItemTypeDropdownSelect('object') },
    { type: 'regular', title: 'Array', onSelect: () => handleArrayItemTypeDropdownSelect('array') },
  ];

  const renderRootTypeDisplay = () => {
    const rootType = schemaObject.type || '';
    return (
      <div className="flex items-center">
        <span
          style={{
            color: getColorForType(rootType),
            borderRadius: '3px',
            padding: '2px 4px',
            fontSize: '14px',
            fontFamily: 'Inter, Helvetica',
          }}
        >
          {rootType}
        </span>
        <DropdownMenu
          trigger={<button>&#9662;</button>}
          items={rootTypeOptions}
          side="bottom"
          align="start"
        />
      </div>
    );
  };

  const renderArrayItemTypeDisplay = () => {
    if (schemaObject.type === 'array') {
      const itemType = schemaObject.items?.type || '';
      return (
        <div className="flex items-center">
          <span
            style={{
              color: getColorForType(`Array<${itemType}>`),
              borderRadius: '3px',
              padding: '2px 4px',
              fontSize: '14px',
              fontFamily: 'Inter, Helvetica',
            }}
          >
            {`Array<${itemType}>`}
          </span>
          <DropdownMenu
            trigger={<button>&#9662;</button>}
            items={itemTypeOptions}
            side="bottom"
            align="start"
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="visual-editor" style={{ width: '45vw', minWidth: '550px', background: '#0F172A', color: '#CBD5E1', fontFamily: 'Inter, sans-serif', padding: '20px'}}>
      {renderRootTypeDisplay()}
      {renderArrayItemTypeDisplay()}
      <SchemaObject
        schema={schemaObject.type === 'array' ? schemaObject.items : schemaObject}
        onSchemaChange={(newSchema: any) => handleSchemaChange(newSchema)}
        path={schemaObject.type === 'array' ? 'items' : ''}
        level={0}
      />
    </div>
  );
};

export default VisualEditor;