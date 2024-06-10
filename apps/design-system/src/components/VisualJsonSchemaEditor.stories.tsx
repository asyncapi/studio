import React, { useState } from 'react';
import { VisualEditor, CodeEditor, Examples } from '@asyncapi/studio-ui';

const VisualEditorStory = {
  component: VisualEditor,
  parameters: {
    layout: 'fullscreen',
  },
};
type TemplateProps = {
  initialSchema: string;
};

const Template: React.FC<TemplateProps> = ({ initialSchema }) => {
  const [schema, setSchema] = useState<string>(initialSchema);
  const [editorType, setEditorType] = useState<'visual' | 'code' | 'examples'>('visual');


  return (
    <div>
      <div style={{ width: '45vw', minWidth:'550px', background: '#0F172A', color: '#CBD5E1', fontFamily: 'Inter, sans-serif' }}>
        <button style={{padding: 5}} onClick={() => setEditorType('visual')}>Visual Editor </button>
        <button style={{padding: 5}} onClick={() => setEditorType('code')}>Code Editor </button>
        <button style={{padding: 5}} onClick={() => setEditorType('examples')}>Examples </button>
      </div>
      <div>
        {editorType === 'visual' && (
          <VisualEditor schema={schema} onSchemaChange={setSchema} />
        )}
        {editorType === 'code' && (
          <CodeEditor schema={schema} onSchemaChange={setSchema} />
        )}
        {editorType === 'examples' && (
          <Examples/>
        )}
      </div>
    </div>
  );
};

export const Sample_Schema = () => (
  <Template
    initialSchema={JSON.stringify({
      "type": "object",
      "properties": {
     
        "age": {
          "type": "integer"
        },
        "address": {
          "type": "object",
          "properties": {
            "street": {
              "type": "string"
            },
            "city": {
              "type": "string"
            },
            "pincode":{
              "type": "number"
            }
          },
          "required": [
            "street",
            "city"
          ]
        }
      }
    }, null, 2)}
  />
);

export const Schema_with_array_object = () => (
  <Template
    initialSchema={JSON.stringify({
      "type": "object",
      "properties": {
        "firstName": {
          "type": "string"
        },
        "lastName": {
          "type": "string"
        },
        "age": {
          "type": "boolean"
        },
        "height": {
          "type": ["integer", "null"]
        },
        "friends": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "firstName": {
                "type": "string"
              }
            },
            "required": ["firstName"]
          }
        }
      },
      "required": ["firstName", "lastName"]
    }
    , null, 2)}
  />
);

export const WithArray_obj = () => (
  <Template
    initialSchema={JSON.stringify({
      "type": "object",
      "properties": {
        "books": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "title": {
                "type": "string"
              },
              "author": {
                "type": "string"
              }
            }
          }
        }
      }
    }, null, 2)}
  />
);

export const WithArray_obj_and_obj = () => (
  <Template
    initialSchema={JSON.stringify({
      "type": "object",
      "properties": {
          "books": {
              "type": "array",
              "items": {
                  "type": "object",
                  "properties": {
                      "title": {"type": "string"},
                      "author": {"type": "string"}
                  },
                  "required": ["title"]
              }
          },
          "list": {
              "type": "object",
              "properties": {
                  "hii": {"type": "string"}
              }
          }
      },
      "required": ["books", "list"]
    }, null, 2)}
  />
);

export const Array_of_string = () => (
  <Template
    initialSchema={JSON.stringify({
      "type": "object",
      "properties": {
        "numbers": {
          "type": "array",
          "items": {
            "type": "number"
          }
        },
        "aString": {
          "type": "string"
        },
        "aNumber": {
          "type": "number"
        }
      },
      "required": ["numbers", "aString", "aNumber"]
    }, null, 2)}
  />
);

export const Root_Array_of_Object = () => (
  <Template
    initialSchema={JSON.stringify({
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer"
          },
          "name": {
            "type": "string"
          },
          "isActive": {
            "type": "boolean"
          }
        },
        "required": ["id", "name"]
      }
    }, null, 2)}
  />
);

export const TwoPropertyHavingSameName = () => (
  <Template
    initialSchema={JSON.stringify({

      "type": "object",
      "properties": {
        "address": {
          "type": "object",
          "properties": {
            "address": { "type": "object",
            "properties": {
              "street": { "type": "string" },
              "city": { "type": "string" }
            }
          }
          }
        }
      }
    }
    
    , null, 2)}
  />
);

export const NesteadArray = () => (
  <Template
    initialSchema={JSON.stringify(
      {
        "type": "object",
        "properties": {
          "age": {
            "type": "integer"
          },
          "address": {
            "type": "object",
            "properties": {
              "street": {
                "type": "string"
              },
              "city": {
                "type": "string"
              },
              "pincode": {
                "type": "number"
              },
              "contact_number": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "name": {
                      "type": "string"
                    },
                    "mobile":{
                      "type": "stirng"
                    },
                    "address": {
                      "type": "object",
                      "properties":{
                        "city":{
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            },
            "required": [
              "street",
              "city"
            ]
          }
        }
      }, null, 2)}
  />
);

export const Blank_schema = () => (
  <Template
    initialSchema={JSON.stringify(
      {}, null, 2)}
  />
);

export const Root_string = () => (
  <Template
    initialSchema={JSON.stringify(
      {
        "type": "string"
      }, null, 2)}
  />
);

export const Multiple_data_types = () => (
  <Template
    initialSchema={JSON.stringify(
      {
        type: "object",
        properties: {
          mixedTypeProperty: {
            type: ["boolean", "integer"],
          },
        },
        required: ["mixedTypeProperty"],
      },
      null,
      2
    )}
  />
);


export default VisualEditorStory
