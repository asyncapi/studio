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

    if (normalizedPath === 'items' || normalizedPath.startsWith('items.properties')) {
      console.log("normalized path", normalizedPath)
      const itemsPath = normalizedPath === 'items' ? normalizedPath : normalizedPath.split('.properties')[0];
      const propertyName = normalizedPath === 'items' ? '' : normalizedPath.split('.').pop();
      _.set(updatedSchema, `${itemsPath}.properties.${propertyName}`, propertySchema);
    } else {
      _.set(updatedSchema, normalizedPath, propertySchema);
    }
    
    console.log(`Property added at ${normalizedPath}`, updatedSchema);
    onSchemaChange(updatedSchema);
  };

  const handleRemoveProperty = (propertyPath: string) => {
    const updatedSchema = _.cloneDeep(schema);
    const normalizedPath = propertyPath.startsWith(".")
      ? propertyPath.slice(1)
      : propertyPath;
      console.log("normalized path", normalizedPath)

      if (normalizedPath.startsWith('items.properties')) {
        const path = normalizedPath.split(".").slice(1).join(".");
        console.log("path", path)
        _.unset(updatedSchema, path);
      } else {
        _.unset(updatedSchema, normalizedPath);
      }

      const propertyName = normalizedPath.split(".").pop();
      console.log("propertyName", propertyName)
      console.log("updatedSchema.properties.required", updatedSchema)
      console.log("normalizedPath", normalizedPath)
      const parentPath = normalizedPath.slice(
        0,
        normalizedPath.lastIndexOf(".")
      );
      const schemaPath = parentPath.split('.properties');
      const requiredPath = schemaPath.slice(0, -1).join('.properties') + '.required';
      const nestedRequired = _.get(updatedSchema, requiredPath, []);

      if (nestedRequired.includes(propertyName)) {
        _.set(
          updatedSchema,
          requiredPath,
          nestedRequired.filter((requiredProp: string) => requiredProp !== propertyName)
        );
      }
    console.log("updatedSchema", JSON.stringify(updatedSchema))
    onSchemaChange(updatedSchema);
  };

  const handleTypeChange = (propertyPath: string, newSchema: any, newType: any) => { // Added types to resolve TS7006
    console.log(`handleTypeChange called with path: ${propertyPath}, newType: ${newType}`);
    const normalizedPath = propertyPath.startsWith('.') ? propertyPath.slice(1) : propertyPath;
    const currentSchema = _.cloneDeep(schema);
    const typePath = `${normalizedPath}.type`;

    const propertyName = normalizedPath.split(".").slice(-1)[0];
      const parentPath = normalizedPath.slice(0, normalizedPath.lastIndexOf('.'));
      const requiredPath = `${parentPath}.${propertyName}.required`;
      const nestedRequired = _.get(currentSchema, requiredPath, []);

      if (nestedRequired?.length > 0 ) {
        _.unset(currentSchema, requiredPath);
      }

    if(newType.type == "array") {
      const itemType = newType.items;
      _.set(currentSchema, typePath, 'array');
      _.set(currentSchema, `${normalizedPath}.items`, itemType);
    } else {
      const newTypeValue = newType.type;
      _.set(currentSchema, typePath , newTypeValue);
      const itemsPath = `${normalizedPath}.items`;
      _.unset(currentSchema, itemsPath);
    }
    _.unset(currentSchema, `${normalizedPath}.properties`)

    console.log(`Type changed at ${propertyPath}`, newSchema);
    onSchemaChange(currentSchema);
  };

  const handleToggleRequired = (path:string, name: string) => {
    const updatedSchema = _.cloneDeep(schema);
    const existingRequired = _.get(updatedSchema, `required`, []);
    const isRequirePresent = existingRequired.includes(name);
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
    const schemaPath = normalizedPath.split('.properties');
    const requiredPath = schemaPath.slice(0, -1).join('.properties') + '.required';
  
    const existingRequired = _.get(updatedSchema, requiredPath, []);
    const isRequirePresent = existingRequired.includes(name);
  
    if (!isRequirePresent) {
      const newRequired = _.uniq([...existingRequired, name]);
      _.set(updatedSchema, requiredPath, newRequired);
    } else {
      const newRequired = existingRequired.filter((item: string) => item !== name);
      _.set(updatedSchema, requiredPath, newRequired);
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
