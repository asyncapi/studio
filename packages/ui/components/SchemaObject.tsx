// SchemaObject.tsx
import React from 'react';
import _ from 'lodash'; // Import lodash
import SchemaProperty from './SchemaProperty';
import PropertyControls from './PropertyControls';

interface SchemaObjectProps {
  schema: any; // Accept any type for schema to simplify types here
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
  console.log(`Rendering SchemaObject. Path: ${path}, Level: ${level}`);

  const handleAddProperty = (fullPath, propertySchema) => {
    let updatedSchema = _.cloneDeep(schema); // Deep clone for immutability

    // Directly using fullPath to update the schema
    // Ensure fullPath does not start with a '.' which could lead to an incorrect root key
    const normalizedPath = fullPath.startsWith('.') ? fullPath.slice(1) : fullPath;
    console.log("Normalised path",normalizedPath);
    _.set(updatedSchema, normalizedPath, propertySchema);

    console.log(`Property added at ${normalizedPath}`, updatedSchema);

    onSchemaChange(JSON.stringify(updatedSchema)); // Update the state with the new schema
};

  const handleRemoveProperty = (propertyPath) => {
    let currentSchema = _.cloneDeep(schema); // Deep clone for immutability
    _.unset(currentSchema, propertyPath); // Use lodash to remove the property
    console.log(`Removed property at ${propertyPath}`);
    onSchemaChange(path, currentSchema);
  };

  const handleTypeChange = (propertyPath, newSchema) => {
    console.log(`handleTypeChange called with path: ${propertyPath}, newType: ${newSchema}`);
    if (path.includes(".items") && newSchema === "object") {
      // This might be an indication that we're dealing with an array of objects.
      // Add your logic here to decide whether to proceed with the type change.
      return;
    }
    let currentSchema = _.cloneDeep(schema); // Deep clone for immutability
    _.set(currentSchema, propertyPath, newSchema); // Use lodash to update the property schema
    console.log(`Type changed at ${propertyPath}`, newSchema);
    onSchemaChange(path, currentSchema);
  };

  return (
    <div style={{ margin: '10px 0' }}>
      {_.map(schema.properties, (propertySchema, propertyName) => (
        <SchemaProperty
          key={propertyName}
          name={propertyName}
          schema={propertySchema}
          onRemove={handleRemoveProperty}
          onToggleRequired={() => console.log('Toggling required')} // Placeholder for required toggling
          isRequired={_.includes(schema.required, propertyName)}
          onTypeChange={handleTypeChange}
          onAddNestedProperty={handleAddProperty}
          onRemoveNestedProperty={handleRemoveProperty}
          onToggleNestedRequired={() => console.log('Toggling nested required')} // Placeholder for nested required toggling
          path={`${path}.properties.${propertyName}`}
          level={level + 1}
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
