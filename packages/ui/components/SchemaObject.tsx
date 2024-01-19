// SchemaObject.tsx
import React from 'react';
import SchemaProperty from './SchemaProperty';
import PropertyControls from './PropertyControls';

const SchemaObject = ({
  schema,
  onSchemaChange,
  path,
  level
}) => {
  console.log(`Rendering SchemaObject. Path: ${path}, Level: ${level}`);

  const updateSchemaAtPath = (currentSchema, pathArray, newProperty) => {
    console.log(`updateSchemaAtPath called. Path Array: ${pathArray.join('.')}, New Property:`, newProperty);
    let schemaPart = currentSchema;
  
    pathArray.forEach((part, index) => {
      console.log(`Navigating to: ${part}, at index: ${index}`);
  
      if (index < pathArray.length - 1) {
        if (!schemaPart.properties || !schemaPart.properties[part]) {
          console.error(`Property '${part}' not found at path: ${pathArray.slice(0, index).join('.')}`);
          return;
        }
        schemaPart = schemaPart.properties[part];
      }
  
      console.log(`Current schema part after navigation:`, schemaPart);
    });
  
    const propertyName = pathArray[pathArray.length - 1];
    schemaPart.properties[propertyName] = newProperty.schema;
    console.log(`Schema part after property addition:`, currentSchema);
  
    return currentSchema;
  };
  
  const handleAddProperty = (fullPath, newProperty) => {
    console.log(`handleAddProperty called. Full Path: ${fullPath}, New Property:`, newProperty);
  
    let updatedSchema = JSON.parse(JSON.stringify(schema));
    const pathArray = fullPath.split('.');
    updatedSchema = updateSchemaAtPath(updatedSchema, pathArray, newProperty);
  
    console.log('Schema after handleAddProperty:', updatedSchema);
    onSchemaChange(path, updatedSchema);
  };
  

  // Handler to remove a property from the schema
  const handleRemoveProperty = (path, propertyName) => {
    const newSchema = { ...schema };
    delete newSchema.properties[propertyName];
    newSchema.required = newSchema.required?.filter(name => name !== propertyName);
    onSchemaChange(path, newSchema);
  };

  // Handler to toggle required status of a property
  const handleToggleRequired = (path, propertyName) => {
    const newSchema = { ...schema };
    if (newSchema.required?.includes(propertyName)) {
      newSchema.required = newSchema.required.filter(name => name !== propertyName);
    } else {
      if (!newSchema.required) {
        newSchema.required = [];
      }
      newSchema.required.push(propertyName);
    }
    onSchemaChange(path, newSchema);
  };

  // Handler to change the type of a property
  const handleTypeChange = (path, propertyName, newSchemaForProperty) => {
    const newSchema = { ...schema };
    newSchema.properties[propertyName] = newSchemaForProperty;
    onSchemaChange(path, newSchema);
  };

  return (
    <div style={{ margin: '10px 0' }}>
      {Object.keys(schema.properties || {}).map((propertyName) => (
        
        <SchemaProperty
          key={propertyName}
          name={propertyName}
          schema={schema.properties[propertyName]}
          onRemove={handleRemoveProperty}
          onToggleRequired={handleToggleRequired}
          isRequired={schema.required?.includes(propertyName)}
          onTypeChange={handleTypeChange}
          onAddNestedProperty={handleAddProperty}
          onRemoveNestedProperty={handleRemoveProperty}
          onToggleNestedRequired={handleToggleRequired}
          path={path ? `${path}.${propertyName}` : propertyName}
          level={level}
        />
      ))}

      {/* Show property controls only if the schema is of type 'object' */}
      {schema.type === 'object' && (
        <PropertyControls
          onAdd={handleAddProperty}
          onRemove={handleRemoveProperty}
          onToggleRequired={handleToggleRequired}
          schemaPath={path}
          level={level}
          requiredFields={schema.required || []}
        />
      )}
    </div>
  );
};

export default SchemaObject;