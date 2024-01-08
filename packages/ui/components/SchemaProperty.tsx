// SchemaProperty.tsx
import React from 'react';
import SchemaObject from './SchemaObject';
import PropertyControls from './PropertyControls';

const SchemaProperty = ({
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
    const handleTypeChange = (event) => {
        const newType = event.target.value;
        const updatedSchema = { ...schema, type: newType };

        if (newType === 'array') {
            // Initialize as an array of strings if not already specified
            updatedSchema.items = schema.items || { type: 'string' };
        } else if (newType === 'object' && !updatedSchema.properties) {
            // Initialize properties for new object type
            updatedSchema.properties = {};
        }

        onTypeChange(path, name, updatedSchema);
    };

    const handleRemove = () => {
        onRemove(path, name);
    };

    const handleToggleRequired = () => {
        onToggleRequired(path, name);
    };

    const renderArrayItemsProperties = () => {
        if (schema.type === 'array' && schema.items && schema.items.type === 'object') {
            return (
                <SchemaObject
                    schema={schema.items}
                    onSchemaChange={(newItemsSchema) => onTypeChange(path, name, { ...schema, items: newItemsSchema })}
                    path={`${path}.${name}.items`}
                    level={level + 1}
                />
            );
        }
        return null;
    };

    const renderNestedProperties = () => {
        if (schema.type === 'object') {
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
                    path={`${path}.${name}`}
                    level={level + 1}
                />
            ));
        }
        return null;
    };

    return (
        <div style={{ marginLeft: `${level * 20}px`, borderLeft: '1px solid grey', paddingLeft: '10px' }}>
            <div>
                <strong>{name}</strong> - Type: 
                <select value={schema.type} onChange={handleTypeChange}>
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="object">Object</option>
                    <option value="array">Array</option>
                </select>
                <button onClick={handleRemove}>Remove</button>
                <button onClick={handleToggleRequired}>
                    {isRequired ? 'Unmark as Required' : 'Mark as Required'}
                </button>
            </div>
            {renderNestedProperties()}
            {renderArrayItemsProperties()}

            {/* Add PropertyControls for nested objects */}
            {schema.type === 'object' && (
                <PropertyControls
                    onAdd={onAddNestedProperty}
                    schemaPath={`${path}.${name}`}
                    level={level + 1}
                />
            )}

        </div>
    );
};

export default SchemaProperty;
