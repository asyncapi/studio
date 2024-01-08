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
  // Handler to add a new property to the schema
  const updateNestedSchema = (currentSchema, pathParts, newProperty) => {
    if (pathParts.length === 0) {
        // Directly add the property if we're at the target location
        currentSchema.properties = currentSchema.properties || {};
        currentSchema.properties[newProperty.name] = newProperty.schema;
        return currentSchema;
    }

    const nextPathPart = pathParts.shift();
    if (!currentSchema.properties[nextPathPart]) {
        // Initialize a nested object if it doesn't exist
        currentSchema.properties[nextPathPart] = { type: 'object', properties: {} };
    }

    // Recursively update the nested object
    currentSchema.properties[nextPathPart] = updateNestedSchema(
        currentSchema.properties[nextPathPart],
        pathParts,
        newProperty
    );

    return currentSchema;
};

const handleAddProperty = (path, newProperty) => {
    const pathParts = path.split('.').filter(Boolean);
    let updatedSchema = JSON.parse(JSON.stringify(schema)); // Deep clone to prevent direct state mutation

    updatedSchema = updateNestedSchema(updatedSchema, pathParts, newProperty);

    // Update the state and propagate the changes to the parent component
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
