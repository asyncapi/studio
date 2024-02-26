// SchemaObject.tsx
import React from 'react';
import SchemaProperty from './SchemaProperty';
import PropertyControls from './PropertyControls';

interface SchemaObjectProps {
  schema: any; // Updated to accept any type for schema to simplify types here
  onSchemaChange: (path: string, newSchema: any) => void; // Adjusted for simplicity
  path: string;
  level: number;
}

const SchemaObject: React.FC<SchemaObjectProps> = ({
  schema,
  onSchemaChange,
  path,
  level,
}) => {
  console.log(`Rendering SchemaObject at path: ${path}, level: ${level}`);

  const handleAddProperty = (fullPath, propertyType) => {
    // Construct the new property schema based on the type
    const newPropertySchema = { type: propertyType };
    if (propertyType === 'object') {
      newPropertySchema.properties = {}; // Initialize an empty properties object for objects
    } else if (propertyType === 'array') {
      newPropertySchema.items = { type: 'string' }; // Default to string type for array items
    }
  
    // Call handleSchemaChange to update the schema
    onSchemaChange(fullPath, newPropertySchema);
  };
  

  const handleRemoveProperty = (propertyPath: string) => {
    console.log(`Removing property at ${propertyPath}`);
    const pathParts = propertyPath.split('.');
    let currentSchema = { ...schema };

    let target = currentSchema;
    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];
      target = target[part];
    }

    delete target[pathParts[pathParts.length - 1]];
    onSchemaChange(path, currentSchema);
  };

  const handleTypeChange = (propertyPath: string, newSchemaForProperty: any) => {
    console.log(`Type change at ${propertyPath}`);
    const pathParts = propertyPath.split('.');
    let currentSchema = { ...schema };

    let target = currentSchema;
    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];
      target = target[part];
    }

    target[pathParts[pathParts.length - 1]] = newSchemaForProperty;
    onSchemaChange(path, currentSchema);
  };

  return (
    <div style={{ margin: '10px 0' }}>
      {Object.keys(schema.properties || {}).map((propertyName) => (
        <SchemaProperty
          key={propertyName}
          name={propertyName}
          schema={schema.properties[propertyName]}
          onRemove={handleRemoveProperty}
          onToggleRequired={(propertyPath, propName) => console.log(`Toggling required: ${propertyPath} ${propName}`)} // Simplified for brevity
          isRequired={schema.required?.includes(propertyName)}
          onTypeChange={handleTypeChange}
          onAddNestedProperty={handleAddProperty}
          onRemoveNestedProperty={handleRemoveProperty}
          onToggleNestedRequired={(propertyPath, propName) => console.log(`Toggling nested required: ${propertyPath} ${propName}`)} // Simplified for brevity
          path={`${path}.properties.${propertyName}`}
          level={level}
        />
      ))}

      <PropertyControls
        onAdd={handleAddProperty}
        schemaPath={path}
        level={level}
      />
    </div>
  );
};

export default SchemaObject;
