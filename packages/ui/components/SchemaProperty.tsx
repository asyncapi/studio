// SchemaProperty.tsx
import React from 'react';
import SchemaObject from './SchemaObject';
import PropertyControls from './PropertyControls';
import { RequiredIcon, NotRequiredIcon } from './icons';

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
  console.log(`Rendering SchemaProperty. Name: ${name}, Path: ${path}, Schema:`, JSON.stringify(schema, null, 2));

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = event.target.value;
    const updatedSchema = { ...schema, type: newType };

    if (newType === 'array') {
      updatedSchema.items = schema.items || { type: 'string' };
    } else if (newType === 'object' && !updatedSchema.properties) {
      updatedSchema.properties = {};
    }

    console.log(`Type change for ${name} at ${path} to ${newType}`);
    onTypeChange(path, name, updatedSchema);
  };

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
      console.log(`Rendering items for array ${name} at ${path}`);
      return (
        <SchemaObject
          schema={schema.items}
          onSchemaChange={(newItemsSchema) => onTypeChange(`${path}.items`, name, { ...schema, items: newItemsSchema })}
          path={`${path}.items`}
          level={level + 1}
        />
      );
    }
    return null;
  };

  const renderNestedProperties = () => {
    if (schema.type === 'object') {
      console.log(`Rendering nested properties for ${name} at ${path}`);
      return Object.keys(schema.properties || {}).map((nestedName) => (
        <SchemaProperty
          key={nestedName}
          name={nestedName}
          schema={schema.properties[nestedName]}
          onRemove={onRemoveNestedProperty}
          onToggleRequired={onToggleNestedRequired}
          isRequired={(schema.required || []).includes(nestedName)}
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

  return (
    <div style={{ marginLeft: `${level * 20}px`, borderLeft: '1px solid grey', paddingLeft: '10px', marginBottom: '-8px' }}>
      <div className="flex items-center gap-[6px]">
        <strong className="[font-family:'Inter',Helvetica] font-medium text-extendedblue-gray300">{name}</strong>
        <select
          value={schema.type}
          onChange={handleTypeChange}
          style={{
            backgroundColor: '#0F172A',
            color: 'white',
            borderRadius: '3px',
            padding: '2px',
            fontSize: '14px',
            fontFamily: 'Inter, Helvetica'
          }}
        >
          <option value="">Select type</option>
          <option value="string">String</option>
          <option value="number">Number</option>
          <option value="boolean">Boolean</option>
          <option value="object">Object</option>
          <option value="array">Array</option>
        </select>
        <button onClick={handleRemove}>Remove</button>
        <button onClick={handleToggleRequired}>
          {isRequired ? <RequiredIcon className="w-4 h-4" /> : <NotRequiredIcon className="w-4 h-4" />}
        </button>
      </div>
      {renderNestedProperties()}
      {renderArrayItemsProperties()}

      {/* Add PropertyControls for nested objects */}
      {schema.type === 'object' && (
        <PropertyControls
          onAdd={onAddNestedProperty}
          schemaPath={`${path}`}
          level={level + 1}
        />
      )}
    </div>
  );
};

export default SchemaProperty;
