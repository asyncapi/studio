import React, { useState } from 'react';
import _ from 'lodash';
import PropertyControls from './PropertyControls';
import { RequiredIcon, NotRequiredIcon, TrashIcon } from '../icons';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../DropdownMenu';
import { IoIosArrowDropdown } from "react-icons/io"; 

interface SchemaPropertyProps {
    name: string;
    schema: any;
    onRemove: (path: string, propertyName: string) => void;
    onToggleRequired: (path: string, propertyName: string) => void;
    isRequired: boolean;
    onTypeChange: (path: string, propertyName: string, newSchema: any) => void;
    onAddNestedProperty: (fullPath: string, newProperty: any) => void;
    onRemoveNestedProperty: (path: string, propertyName: string) => void;
    onToggleNestedRequired: (path: string, propertyName: string) => void;
    path: string;
    level: number;
}

export const getColorForType = (type: string, itemType?: string) => {
  const typeColors: Record<string, string> = {
    object: 'blue',
    string: 'orange',
    boolean: 'green',
    number: 'yellow',
    integer: 'yellow',
    array: 'red',
  };

  if (type === 'array') {
    return 'red';
  }

  if (itemType) {
    return typeColors[itemType] || 'white';
  }

  return typeColors[type] || 'white';
};

const SchemaProperty: React.FC<SchemaPropertyProps> = ({
  name, 
  schema, 
  onRemove, 
  onToggleRequired, 
  isRequired, 
  onTypeChange, 
  onAddNestedProperty, 
  onRemoveNestedProperty, 
  onToggleNestedRequired, 
  path, 
  level 
}) => {
  console.log(`Rendering SchemaProperty. Name: ${name}, Path: ${path}, Level: ${level}`);

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = event.target.value;
    const updatedSchema = _.cloneDeep(schema);
    updatedSchema.type = newType;

    if (newType === 'array') {
      updatedSchema.type = 'array';
      updatedSchema.items = updatedSchema.items || { type: 'string' };
    } else {
      updatedSchema.type = newType;
      if (newType === 'object') {
            updatedSchema.properties = updatedSchema.properties || {};
        }
    }

    console.log(`Type changed for ${name} at ${path} to ${newType}`);
    onTypeChange(path, name, updatedSchema);
  };

  const handleItemTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemType = event.target.value;
    const updatedSchema = _.cloneDeep(schema);
    updatedSchema.items.type = newItemType;

    if (newItemType === 'object') {
      updatedSchema.properties = updatedSchema.properties || {};
    } 

    console.log(`Item type changed for ${name} at ${path} to ${newItemType}`);
    onTypeChange(path, name, updatedSchema);
  };

  const handleTypeDropdownSelect = (selectedOption: string) => {
    handleTypeChange({ target: { value: selectedOption } } as React.ChangeEvent<HTMLSelectElement>);
  };

  const handleItemTypeDropdownSelect = (selectedOption: string) => {
    handleItemTypeChange({ target: { value: selectedOption } } as React.ChangeEvent<HTMLSelectElement>);
  };

  const typeOptions = [
    { title: 'String', onSelect: () => handleTypeDropdownSelect('string') },
    { title: 'Number', onSelect: () => handleTypeDropdownSelect('number') },
    { title: 'Boolean', onSelect: () => handleTypeDropdownSelect('boolean') },
    { title: 'Object', onSelect: () => handleTypeDropdownSelect('object') },
    { title: 'Array', onSelect: () => handleTypeDropdownSelect('array') },
  ];

  const itemTypeOptions = [
    { title: 'String', onSelect: () => handleItemTypeDropdownSelect('string') },
    { title: 'Number', onSelect: () => handleItemTypeDropdownSelect('number') },
    { title: 'Boolean', onSelect: () => handleItemTypeDropdownSelect('boolean') },
    { title: 'Object', onSelect: () => handleItemTypeDropdownSelect('object') },
  ];

  const handleRemove = () => {
    console.log(`Removing property ${name} at ${path}`);
    onRemove(path, name);
  };

  const handleToggleRequired = () => {
    console.log(`Toggling required for ${name} at ${path}`);
    onToggleRequired(path, name);
  };

  const renderArrayItemsProperties = () => {
    if (schema.type === 'array' && schema.items && schema.items.type === 'object') {
      return (
        <div>
        {_.map(schema.items.properties, (nestedSchema, nestedName) => (
          <SchemaProperty
            key={nestedName}
            name={nestedName}
            schema={nestedSchema}
            onRemove={onRemove}
            onToggleRequired={onToggleNestedRequired}
            isRequired={_.includes(schema.items.required, nestedName)}
            onTypeChange={onTypeChange}
            onAddNestedProperty={onAddNestedProperty}
            onRemoveNestedProperty={onRemoveNestedProperty}
            onToggleNestedRequired={onToggleNestedRequired}
            path={`${path}.items.properties.${nestedName}`}
            level={level + 1}            
          />
        ))}
        <PropertyControls
          onAdd={onAddNestedProperty}
          schemaPath={`${path}.items`}
          level={level + 1}
        />
      </div>
      );
    }
    return null;
  };
  
  const renderNestedProperties = () => {
    if (schema.type === 'object') {
      return _.map(schema.properties, (nestedSchema, nestedName) => (
        <SchemaProperty
          key={nestedName}
          name={nestedName}
          schema={nestedSchema}
          onRemove={onRemoveNestedProperty}
          onToggleRequired={onToggleNestedRequired}
          isRequired={_.includes(schema.required, nestedName)}
          onTypeChange={onTypeChange}
          onAddNestedProperty={onAddNestedProperty}
          onRemoveNestedProperty={onRemoveNestedProperty}
          onToggleNestedRequired={onToggleNestedRequired}
          path={`${path}.properties.${nestedName}`}
          level={level + 1}
        />
      ));
    }
    return null;
  };

  const renderTypeDisplay = () => {
    if (schema.type === 'array') {
      return;
    }
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    const displayTypes = types.map((type: string) => type.charAt(0).toUpperCase() + type.slice(1));
    return (
      <span
        style={{
          marginLeft: '8px',
          color: getColorForType(schema.type),
          borderRadius: '3px',
          padding: '2px 4px',
          fontSize: '14px',
          fontFamily: 'Inter, Helvetica',
        }}
      >
        {displayTypes.join(' | ')}
      </span>
    );
  };

  const renderItemTypeDisplay = () => {
  
    if (schema.type === 'array' && schema.items?.type) {
      const itemTypes = Array.isArray(schema.items.type) ? schema.items.type : [schema.items.type];
      const displayItemTypes = itemTypes.map((type: string) => type.charAt(0).toUpperCase() + type.slice(1));
      return (
        <span
          style={{
            marginLeft: '8px',
            color: getColorForType('array', schema.items.type),
            borderRadius: '3px',
            padding: '2px 4px',
            fontSize: '14px',
            fontFamily: 'Inter, Helvetica',
          }}
        >
          {`Array<${displayItemTypes.join(' | ')}>`}
        </span>
      );
    }
    return null;
  };

  const renderCollapseIcon = () => {
    if (schema.type === 'object' || schema.type === 'array') {
      return (
        <button onClick={toggleCollapse} className="focus:outline-none">
          <IoIosArrowDropdown
            className={`w-4 h-4 transition-transform ${
              isCollapsed ? 'transform -rotate-90' : ''
            }`}
          />
        </button>
      );
    }
    return null;
  };
  
  return (
    <div style={{ marginLeft: `${level * 20}px`, borderLeft: '1px solid grey', marginBottom: '-8px', paddingTop: '4px' }}>
      <div className="flex items-center justify-between">
      <div style={{borderTop: '1px solid grey', width: `${level * 20}px`,
      }}>
      </div>
        <div className='pt-1 flex items-center pl-2'>
          {renderCollapseIcon()}
          <strong className="[font-family:'Inter',Helvetica] font-medium text-extendedblue-gray300 pl-2">{name}</strong>
          {renderTypeDisplay()}
          {renderItemTypeDisplay()}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <button><IoIosArrowDropdown /></button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Select Type</DropdownMenuItem>
              <DropdownMenuSeparator />
              { typeOptions.map((option) => (<DropdownMenuItem key={option.title} onSelect={option.onSelect}>{option.title}</DropdownMenuItem>))}
            </DropdownMenuContent>
          </DropdownMenu>
           
          {schema.type.includes('array') && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button><IoIosArrowDropdown /></button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
              <DropdownMenuItem>Select Item Type</DropdownMenuItem>
              <DropdownMenuSeparator />
                {itemTypeOptions.map((option) => (<DropdownMenuItem key={option.title} onSelect={option.onSelect}>{option.title}</DropdownMenuItem>))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <button style={{ marginRight: '10px' }} onClick={handleRemove}>
            <TrashIcon className="w-4 h-4" />
          </button>
          <button onClick={handleToggleRequired}>
            {isRequired ? <RequiredIcon className="w-4 h-4" /> : <NotRequiredIcon className="w-4 h-4" />}
          </button>
        </div>
      </div>
      {!isCollapsed && (
        <>
          {renderNestedProperties()}
          {renderArrayItemsProperties()}
          {schema.type === "object" && (
            <PropertyControls
              onAdd={onAddNestedProperty}
              schemaPath={`${path}`}
              level={level + 1}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SchemaProperty;
