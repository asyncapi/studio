import React, { useState, useEffect } from 'react';

interface Schema {
  type: string | string[];
  properties?: Record<string, { type: string | string[] }>;
  required?: string[];
}

interface PropertyControlsProps {
  onAdd: (key: string, types: string[]) => void;
}

const PropertyControls: React.FC<PropertyControlsProps> = ({ onAdd }) => {
  const [key, setKey] = useState<string>('');
  const [types, setTypes] = useState<string[]>([]);

  const handleAdd = () => {
    if (key && types.length > 0) {
      onAdd(key, types);
      setKey('');
      setTypes([]);
    } else {
      alert('Please enter both property name and type(s).');
    }
  };

  const toggleType = (type: string) => {
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

interface SchemaPropertyProps {
    name: string;
    schema: { type: string | string[] };
    onRemove: (name: string) => void;
    onToggleRequired: (name: string) => void;
    isRequired: boolean;
  }
  

const SchemaProperty: React.FC<SchemaPropertyProps> = ({
  name,
  schema,
  onRemove,
  onToggleRequired,
  isRequired
}) => {
  const typeDisplay = Array.isArray(schema.type) ? schema.type.join(', ') : schema.type;

  const handleKeyPress = (event: React.KeyboardEvent) => {
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
          tabIndex={0}
        />
      </div>
    </div>
  );
};

interface SchemaObjectProps {
    schema: Schema;
    path: string;
    onAdd: (path: string, updatedSchema: Schema) => void;
    onRemove: (key: string) => void;
    onToggleRequired: (key: string) => void;
  }

  const SchemaObject: React.FC<SchemaObjectProps> = ({ schema, path, onAdd, onRemove, onToggleRequired }) => {
    const properties = schema.properties ?? {};
    const propertyNames = Object.keys(properties);
    const requiredFields = schema.required ?? [];

  const handleAddProperty = (key: string, types: string[]) => {
    const updatedSchema = {
      ...schema,
      properties: {
        ...properties,
        [key]: { type: types },
      },
    };
    onAdd(path, updatedSchema);
  };

  const handleRemoveProperty = (key: string) => {
    if (properties.hasOwnProperty(key)) {
      const { [key]: removedProperty, ...remainingProperties } = properties;
      const updatedRequired = requiredFields.includes(key) ? requiredFields.filter((k) => k !== key) : requiredFields;
      const updatedSchema = {
        ...schema,
        properties: remainingProperties,
        required: updatedRequired,
      };
      onAdd(path, updatedSchema);
    }
  };
  
  const handleToggleRequired = (key: string) => {
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

interface VisualEditorProps {
  schema: string;
  onSchemaChange: (updatedSchema: string) => void;
}

export const VisualEditor: React.FC<VisualEditorProps> = ({ schema, onSchemaChange }) => {
    const [schemaObject, setSchemaObject] = useState<Schema>({ type: 'object', properties: {}, required: [] });
  
    useEffect(() => {
      try {
        const parsedSchema: Schema = JSON.parse(schema);
        setSchemaObject(parsedSchema);
      } catch (e) {
        console.error('Invalid JSON schema:', e);
      }
    }, [schema]);  

  const handleSchemaChange = (path: string, newSchema: Schema) => {
    const updatedSchema = path === '' ? newSchema : { ...schemaObject, ...newSchema };
    setSchemaObject(updatedSchema);
    onSchemaChange(JSON.stringify(updatedSchema, null, 2));
  };

  const handleRemove = (key: string) => {
    if (schemaObject.properties?.hasOwnProperty(key)) {
      const { [key]: removedProperty, ...remainingProperties } = schemaObject.properties;
      const updatedRequired = schemaObject.required 
        ? schemaObject.required.filter((k) => k !== key)
        : [];
      const updatedSchema = {
        ...schemaObject,
        properties: remainingProperties,
        required: updatedRequired,
      };
      setSchemaObject(updatedSchema);
      onSchemaChange(JSON.stringify(updatedSchema, null, 2));
    }
  };

  const handleToggleRequired = (key: string) => {
    const isKeyPresent = schemaObject.required?.includes(key);
    const updatedRequired = isKeyPresent
      ? schemaObject.required?.filter((k) => k !== key)
      : [...(schemaObject.required || []), key];
    
    const updatedSchema = {
      ...schemaObject,
      required: updatedRequired,
    };
  
    setSchemaObject(updatedSchema);
    onSchemaChange(JSON.stringify(updatedSchema, null, 2));
  };

  return (
    <div className="visual-editor">
      <h2>Visual Editor</h2>
      <SchemaObject
        schema={schemaObject}
        path=""
        onAdd={handleSchemaChange}
        onRemove={handleRemove}
        onToggleRequired={handleToggleRequired}
      />
    </div>
  );
};

export default VisualEditor;
