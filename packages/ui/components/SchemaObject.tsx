// SchemaObject.tsx
import React from 'react';
import _ from 'lodash';
import SchemaProperty from './SchemaProperty';
import PropertyControls from './PropertyControls';

interface SchemaObjectProps {
  schema: any;
  onSchemaChange: (newSchema: any) => void;
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
    let updatedSchema = _.cloneDeep(schema); // Deep clone


    const normalizedPath = fullPath.startsWith('.') ? fullPath.slice(1) : fullPath;
    console.log("Normalised path",normalizedPath);
    _.set(updatedSchema, normalizedPath, propertySchema);

    console.log(`Property added at ${normalizedPath}`, updatedSchema);

    onSchemaChange(JSON.stringify(updatedSchema));
};

  const handleRemoveProperty = (propertyPath) => {
    let currentSchema = _.cloneDeep(schema);
    _.unset(currentSchema, propertyPath);
    console.log(`Removed property at ${propertyPath}`);
    onSchemaChange(path, currentSchema);
  };

  const handleTypeChange = (propertyPath, newSchema) => {
    console.log(`handleTypeChange called with path: ${propertyPath}, newType: ${newSchema}`);
    if (path.includes(".items") && newSchema === "object") {
      //
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
