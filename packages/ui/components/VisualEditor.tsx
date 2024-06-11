import React, { useState, useEffect } from 'react';
import SchemaObject from './VisualEditor/SchemaObject';
import _ from 'lodash';
import { getColorForType } from './VisualEditor/SchemaProperty';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './DropdownMenu';
import { IoIosArrowDropdown } from 'react-icons/io';

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
    let updatedSchema = _.cloneDeep(schemaObject);
    console.log("updatedPart.type", updatedPart.type)

    if (updatedSchema.type === 'array') {
        if (updatedPart.items && updatedPart.items.type === 'object') {
          updatedSchema.items = updatedPart.items;
        } else if (updatedPart?.items?.properties) {
          updatedSchema.items = {
            ...updatedSchema.items,
            properties: {
              ...updatedSchema.items.properties,
              ...updatedPart.items.properties,
            },
          };
        } else if (updatedPart.type !== 'object' ) {
          updatedSchema = { ...schemaObject, ...updatedPart };
        } else if (Object.keys(updatedPart.properties).length === 0  && updatedPart?.required === undefined){
          updatedSchema = { ...schemaObject, ...updatedPart };
        } else {
          updatedSchema.items = { ...updatedSchema.items, ...updatedPart };
        }
    } else {
      updatedSchema = { ...schemaObject, ...updatedPart };
    }

    const newSchemaString = JSON.stringify(updatedSchema);
    console.log('Schema updated:', newSchemaString);
    setSchemaObject(updatedSchema);
    onSchemaChange(newSchemaString);
  };

  const handleRootTypeDropdownSelect = (selectedOption: string) => {
    if (selectedOption === 'array') {
      handleSchemaChange({ type: 'array', items: { type: 'string' }, properties: undefined, required: undefined});
    } else {
      handleSchemaChange({ type: selectedOption, properties: undefined, required: undefined});
    }
  };

  const handleArrayItemTypeDropdownSelect = (selectedOption: string) => {
    handleSchemaChange({ items: schemaObject.items ? { ...schemaObject.items, type: selectedOption } : { type: selectedOption } });
  };

  const rootTypeOptions = [
    { title: 'Object', onSelect: () => handleRootTypeDropdownSelect('object') },
    { title: 'Array', onSelect: () => handleRootTypeDropdownSelect('array') },
    { title: 'String', onSelect: () => handleRootTypeDropdownSelect('string') },
    { title: 'Number', onSelect: () => handleRootTypeDropdownSelect('number') },
    { title: 'Boolean', onSelect: () => handleRootTypeDropdownSelect('boolean') },
  ];
  
  const itemTypeOptions = [
    { title: 'String', onSelect: () => handleArrayItemTypeDropdownSelect('string') },
    { title: 'Number', onSelect: () => handleArrayItemTypeDropdownSelect('number') },
    { title: 'Boolean', onSelect: () => handleArrayItemTypeDropdownSelect('boolean') },
    { title: 'Object', onSelect: () => handleArrayItemTypeDropdownSelect('object') },
  ];

  const renderRootTypeDisplay = () => {
    if(schemaObject.type === 'array') {
      return null;
    }
    const rootType = schemaObject.type || '';
    const displayRootType = rootType.charAt(0).toUpperCase() + rootType.slice(1); 
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
          {displayRootType}
        </span>
      </div>
    );
  };

  const renderArrayItemTypeDisplay = () => {
    if (schemaObject.type === 'array' && schemaObject.items) {
      const itemType = schemaObject.items?.type || '';
      return (
        <div className="flex items-center">
          <span
            style={{
              color: getColorForType('array', itemType),
              borderRadius: '3px',
              padding: '2px 4px',
              fontSize: '14px',
              fontFamily: 'Inter, Helvetica',
            }}
          >
            {`Array<${itemType}>`}
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="visual-editor"
      style={{
        width: "45vw",
        minWidth: "550px",
        background: "#0F172A",
        color: "#CBD5E1",
        fontFamily: "Inter, sans-serif",
        padding: "20px",
      }}
    >
      <div className="flex items-center gap-2">
        {renderRootTypeDisplay()}
        {renderArrayItemTypeDisplay()}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button><IoIosArrowDropdown /></button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Select Root Type</DropdownMenuItem>
            <DropdownMenuSeparator />
            {rootTypeOptions.map((menuItem) => (<DropdownMenuItem key={menuItem.title} onSelect={menuItem.onSelect}>{menuItem.title}</DropdownMenuItem>))}
          </DropdownMenuContent>
        </DropdownMenu>
        {schemaObject.type === "array" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button><IoIosArrowDropdown /> </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Select Items Type</DropdownMenuItem>
              <DropdownMenuSeparator />
              {itemTypeOptions.map((menuItem) => (<DropdownMenuItem key={menuItem.title} onSelect={menuItem.onSelect}>{menuItem.title}</DropdownMenuItem>))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      {(schemaObject.type === "object" || (schemaObject.type === "array" && schemaObject.items.type === "object")) && (
        <SchemaObject
          schema={
            schemaObject.type === "array" ? schemaObject.items : schemaObject
          }
          onSchemaChange={(newSchema: any) => handleSchemaChange(newSchema)}
          path={schemaObject.type === "array" ? "items" : ""}
          level={0}
        />
      )}
    </div>
  );
};

export default VisualEditor;
