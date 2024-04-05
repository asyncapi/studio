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

  const handleAddProperty = (fullPath: string, propertySchema: any) => {
    const updatedSchema = _.cloneDeep(schema);
    const normalizedPath = fullPath.startsWith('.') ? fullPath.slice(1) : fullPath;
    console.log('Normalised path',normalizedPath);
    _.set(updatedSchema, normalizedPath, propertySchema);

    console.log(`Property added at ${normalizedPath}`, updatedSchema);
    onSchemaChange(updatedSchema);
  };

  const handleRemoveProperty = (propertyPath: string) => {
    const updatedSchema = _.cloneDeep(schema);
    const normalizedPath = propertyPath.startsWith('.') ? propertyPath.slice(1) : propertyPath;
    console.log("fullPath: ",normalizedPath)
    console.log("propertyPath: ",propertyPath)
    const isRemoved = _.unset(updatedSchema, normalizedPath);

    if (isRemoved) {
      const propertyName = normalizedPath.split('.').pop();
      if (updatedSchema.required) {
        updatedSchema.required = updatedSchema.required.filter(
          (requiredProp: any) => requiredProp !== propertyName
      );
    }
      console.log(`Removed property at ${propertyPath}`);
      console.log("removed schema",updatedSchema);
      onSchemaChange(updatedSchema);
    } else {
      console.log(`Failed to remove property at ${propertyPath}`);
    }
  };

  const handleTypeChange = (propertyPath: string, newSchema: any, newType: any) => { // Added types to resolve TS7006
    const normalizedPath = propertyPath.startsWith('.') ? propertyPath.slice(1) : propertyPath;
    const typePath = `${normalizedPath}.type`;
    const newTypeValue = newType.type;
    console.log("newTypeValue",newTypeValue);
    console.log("normalizedPath",normalizedPath);
    const currentSchema = _.cloneDeep(schema);
    _.set(currentSchema, typePath , newTypeValue);
    console.log(`Type changed at ${propertyPath}`, newSchema);
    onSchemaChange(currentSchema);
    console.log(`handleTypeChange called with path: ${propertyPath}, newType: ${newTypeValue}`);
  };

  const handleToggleRequired = (path:string, name: string) => {
    const normalizedPath = path.startsWith('.') ? path.slice(1) : path;
    /** Todo */
    // const updatedSchema = _.cloneDeep(schema);
    // console.log("normalizedPath", normalizedPath)
    // console.log("path",path)
    // console.log("name",name)
    // console.log("updatedSchema",JSON.stringify(updatedSchema))
  }

  return (
    <div style={{ margin: '10px 0' }}>
      {_.map(schema.properties, (propertySchema, propertyName) => (
        <SchemaProperty
          key={propertyName}
          name={propertyName}
          schema={propertySchema}
          onRemove={handleRemoveProperty}
          onToggleRequired={handleToggleRequired}
          isRequired={_.includes(schema.required, propertyName)}
          onTypeChange={handleTypeChange}
          onAddNestedProperty={handleAddProperty}
          onRemoveNestedProperty={handleRemoveProperty}
          onToggleNestedRequired={() => console.log('Toggling nested required')}
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
