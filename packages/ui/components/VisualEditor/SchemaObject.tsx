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
    console.log(`handleTypeChange called with path: ${propertyPath}, newType: ${newType}`);
    const normalizedPath = propertyPath.startsWith('.') ? propertyPath.slice(1) : propertyPath;
    const typePath = `${normalizedPath}.type`;
    const newTypeValue = newType.type;
    const currentSchema = _.cloneDeep(schema);
    _.set(currentSchema, typePath , newTypeValue);
    console.log(`Type changed at ${propertyPath}`, newSchema);
    onSchemaChange(currentSchema);
  };

  const handleToggleRequired = (path:string, name: string) => {
    const updatedSchema = _.cloneDeep(schema);
    const existingRequired = _.get(updatedSchema, `required`, []);
    const isRequirePresent = existingRequired.includes(name);
    console.log("isRequired",isRequirePresent);
    if(!isRequirePresent) {  
      const newRequired = _.uniq([...existingRequired, name]);
      _.set(updatedSchema, `required`, newRequired);
    } else {
      const newRequired = existingRequired.filter((item: string) => item !== name);
      _.set(updatedSchema, `required`, newRequired);
    }
  
    onSchemaChange(updatedSchema);
  }
  
  const handleToggleNestedRequired = (path: string, name: string) => {
    const updatedSchema = _.cloneDeep(schema);
    const normalizedPath = path.startsWith('.') ? path.slice(1) : path;
    const reqPath = normalizedPath.split('.properties')[0]
    const existingRequired = _.get(updatedSchema, `${reqPath}.required`, []);
    const isRequirePresent = existingRequired.includes(name);
  
    if (!isRequirePresent ) {
      const newRequired = _.uniq([...existingRequired, name]);
      _.set(updatedSchema, `${reqPath}.required`, newRequired);
    } else {
      const newRequired = existingRequired.filter((item: string) => item !== name);
      _.set(updatedSchema, `${reqPath}.required`, newRequired);
    }
  
    onSchemaChange(updatedSchema);
  };

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
          onToggleNestedRequired={handleToggleNestedRequired}
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
