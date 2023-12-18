import React, { useState, useEffect } from 'react';

// Modified PropertyControls to handle multiple types
const PropertyControls = ({ onAdd }) => {
  const [key, setKey] = useState('');
  const [types, setTypes] = useState([]);

  const handleAdd = () => {
    if (key && types.length > 0) {
      onAdd(key, types);
      setKey('');
      setTypes([]);
    } else {
      alert('Please enter both property name and type(s).');
    }
  };

  const toggleType = (type) => {
    if (types.includes(type)) {
      setTypes(types.filter((t) => t !== type));
    } else {
      setTypes([...types, type]);
    }
  };

  return (
    <div>
      <input
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="Property name"
      />
      <div>
        {['string', 'number', 'integer', 'boolean', 'object', 'array', 'null'].map((type) => (
          <label key={type}>
            <input
              type="checkbox"
              checked={types.includes(type)}
              onChange={() => toggleType(type)}
            />
            {type}
          </label>
        ))}
      </div>
      <button onClick={handleAdd}>Add Property</button>
    </div>
  );
};

const SchemaProperty = ({ name, schema, onRemove, onToggleRequired, isRequired }) => {
    const typeDisplay = Array.isArray(schema.type) ? schema.type.join(', ') : schema.type;
  
    const handleKeyPress = (event) => {
        // Trigger the click event when Enter or Space key is pressed
        if (event.key === 'Enter' || event.key === ' ') {
            onToggleRequired(name);
        }
    };

    return (
      <div className="schema-property" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>
          <strong>{name}</strong>: <span>{typeDisplay}</span>
        </span>
        <div>
          <button onClick={() => onRemove(name)}>Remove</button>
          <div
            onClick={() => onToggleRequired(name)}
            onKeyDown={handleKeyPress}
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: isRequired ? 'red' : 'grey',
              cursor: 'pointer',
              marginLeft: '10px',
            }}
            tabIndex={0} // Make the div focusable
          />
        </div>
      </div>
    );
};


  const SchemaObject = ({ schema, path, onAdd, onRemove, onToggleRequired }) => {
    const properties = schema.properties || {};
    const propertyNames = Object.keys(properties);
    const requiredFields = schema.required || [];

  const handleAddProperty = (key, types) => {
    const updatedSchema = {
      ...schema,
      properties: {
        ...properties,
        [key]: { type: types },
      },
    };
    onAdd(path, updatedSchema);
  };

  const handleRemoveProperty = (key) => {
    const { [key]: _, ...remainingProperties } = properties;
    const updatedRequired = requiredFields.includes(key) ? requiredFields.filter((k) => k !== key) : requiredFields;
    const updatedSchema = {
      ...schema,
      properties: remainingProperties,
      required: updatedRequired,
    };
    onAdd(path, updatedSchema);
  };

  const handleToggleRequired = (key) => {
    const isRequired = requiredFields.includes(key);
    const updatedRequired = isRequired
      ? requiredFields.filter((k) => k !== key)
      : [...requiredFields, key];

    const updatedSchema = {
      ...schema,
      required: updatedRequired,
    };
    onAdd(path, updatedSchema);
  };

  return (
    <div className="schema-object">
      {propertyNames.map((key) => (
        <SchemaProperty
          key={key}
          name={key}
          schema={properties[key]}
          onRemove={handleRemoveProperty}
          onToggleRequired={handleToggleRequired}
          isRequired={requiredFields.includes(key)}
        />
      ))}
      <PropertyControls onAdd={handleAddProperty} />
    </div>
  );
};

  
  // VisualEditor component updated to handle base level property addition and required field indication
  export const VisualEditor = ({ schema, onSchemaChange }) => {
    const [schemaObject, setSchemaObject] = useState({ type: 'object', properties: {}, required: [] });
  
    useEffect(() => {
      try {
        const parsedSchema = JSON.parse(schema);
        setSchemaObject(parsedSchema);
      } catch (e) {
        console.error('Invalid JSON schema:', e);
      }
    }, [schema]);
  
    const handleSchemaChange = (path, newSchema) => {
      const updatedSchema = path === '' ? newSchema : { ...schemaObject, ...newSchema };
      setSchemaObject(updatedSchema);
      onSchemaChange(JSON.stringify(updatedSchema, null, 2));
    };
  
    const handleToggleRequired = (propertyName) => {
      const isCurrentlyRequired = schemaObject.required.includes(propertyName);
      const updatedRequired = isCurrentlyRequired
        ? schemaObject.required.filter((name) => name !== propertyName)
        : [...schemaObject.required, propertyName];
  
      setSchemaObject({ ...schemaObject, required: updatedRequired });
    };
  
    return (
      <div className="visual-editor">
        <h2>Visual Editor</h2>
        <SchemaObject
          schema={schemaObject}
          path=""
          onAdd={handleSchemaChange}
          onRemove={handleSchemaChange}
          onToggleRequired={handleToggleRequired}
        />
      </div>
    );
  };
  
  export default VisualEditor;