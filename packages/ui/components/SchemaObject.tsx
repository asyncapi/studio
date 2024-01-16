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
    let schemaPart = currentSchema;
  
    // Navigate to the correct location in the schema
    for (let i = 0; i < pathArray.length - 1; i++) {
      const part = pathArray[i];
      if (!schemaPart.properties || !schemaPart.properties[part]) {
        schemaPart.properties = { ...schemaPart.properties, [part]: { type: 'object', properties: {} } };
      }
      schemaPart = schemaPart.properties[part];
    }
  
    // Add the new property to the schema
    const propertyName = pathArray[pathArray.length - 1];
    schemaPart.properties = { ...schemaPart.properties, [propertyName]: newProperty.schema };
  
    return currentSchema;
  };

  const handleAddProperty = (fullPath, newProperty) => {
    console.log(`handleAddProperty called. fullPath: ${fullPath}, newProperty:`, newProperty);
    console.log(`New property to be added:`, newProperty);
    // Log
  console.log(`New property to be added:`, JSON.stringify(newProperty, null, 2));

    // Correct the path if it has redundant segments
    const pathSegments = fullPath.split('.');
    const correctedPathSegments = pathSegments.filter((value, index, self) => self.indexOf(value) === index);

    console.log(`Corrected Path: ${correctedPathSegments.join('.')}`);

    let updatedSchema = JSON.parse(JSON.stringify(schema));
  const pathArray = fullPath.split('.').filter(Boolean);
  updatedSchema = updateSchemaAtPath(updatedSchema, pathArray, newProperty);

  onSchemaChange(path, updatedSchema);
    console.log('Schema after handleAddProperty:', updatedSchema);
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