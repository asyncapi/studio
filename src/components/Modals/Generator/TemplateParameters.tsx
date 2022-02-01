import React, { useState, useCallback, useImperativeHandle, forwardRef, useEffect, useMemo } from 'react';
import { JSONSchema7, JSONSchema7Definition } from 'json-schema';

import { Switch } from '../../common';

interface TemplateParameterProps {
  propertyName: string;
  property: JSONSchema7;
  setValue: (propertyName: string, value: any) => void;
}

const StringParameter: React.FunctionComponent<TemplateParameterProps> = ({
  propertyName, 
  setValue,
}) => {
  return (
    <input
      name={propertyName}
      className="shadow-sm focus:ring-pink-500 focus:border-pink-500 w-1/2 block sm:text-sm rounded-md p-1 text-gray-700 border-pink-300 border-2"
      onChange={e => setValue(propertyName, e.target.value)}
    />
  );
};

const NumberParameter = StringParameter;

const BooleanParameter: React.FunctionComponent<TemplateParameterProps> = ({
  propertyName,
  property,
  setValue
}) => {
  return (
    <Switch
      toggle={property.default as boolean}
      onChange={(v) => setValue(propertyName, v)}
    />
  );
};

const ParameterItem: React.FunctionComponent<TemplateParameterProps> = (props) => {
  switch (props.property.type) {
  case 'string': {
    return <StringParameter {...props} />;
  }
  case 'number': {
    return <NumberParameter {...props} />;
  }
  case 'boolean': {
    return <BooleanParameter {...props} />;
  }
  default: return null;
  }
};

export interface TemplateParametersHandle {
  getValues(): any;
}

interface TemplateParametersProps {
  templateName: string;
  template: JSONSchema7;
}

export const TemplateParametersSans: React.ForwardRefRenderFunction<TemplateParametersHandle, React.PropsWithChildren<TemplateParametersProps>> = ({
  templateName,
  template: { properties = {}, required = [] },
}, templateParamsRef) => {
  const [values, setValues] = useState<Record<string, any>>({});
  const [showOptionals, setShowOptionals] = useState<boolean>(false);
  const { requiredProps, optionalProps } = useMemo(() => {
    const requiredProps: Record<string, JSONSchema7Definition> = {};
    const optionalProps: Record<string, JSONSchema7Definition> = {};

    Object.keys(properties).forEach(propKey => {
      if (required.includes(propKey)) requiredProps[String(propKey)] = properties[String(propKey)];
      else optionalProps[String(propKey)] = properties[String(propKey)];
    });

    return { requiredProps, optionalProps };
  }, [properties, required]);

  useEffect(() => {
    setValues({});
    setShowOptionals(false);
  }, [templateName, setValues]);

  useImperativeHandle(templateParamsRef, () => ({
    getValues() {
      return values;
    }
  }));

  const setValue = useCallback((propertyName: string, value: any) => {
    setValues(oldValues => {
      oldValues[String(propertyName)] = String(value);
      return oldValues;
    });
  }, []);

  const renderFields = useCallback((propertyName: string, property: JSONSchema7Definition) => {
    return (
      <div key={`${templateName}${propertyName}`} className={'flex flex-col mt-4 text-sm'}>
        <div className="flex flex-row content-center justify-between">
          <label
            htmlFor={propertyName}
            className="flex justify-right items-center w-1/2 content-center font-medium text-gray-700"
          >
            <span>
              {propertyName}
            </span>
            {required.includes(propertyName) && (
              <span className='text-red-400 ml-1'>
                *
              </span>
            )}
          </label>
          <ParameterItem propertyName={propertyName} property={property as JSONSchema7} setValue={setValue} />
        </div>
        <div className='text-gray-400 text-xs mt-1'>
          {(property as JSONSchema7).description}
        </div>
      </div>
    );
  }, [templateName]);

  if (!templateName) {
    return (
      <div className='text-sm text-gray-700 mt-10'>
        Please select template
      </div>
    );
  }

  if (!properties || !Object.keys(properties).length) {
    return (
      <div className='text-sm text-gray-700 mt-10'>
        {'The given template hasn\'t parameters to pass'}
      </div>
    );
  }

  return (
    <form className='w-full'>
      {Object.entries(requiredProps).map(([propertyName, property]) => renderFields(propertyName, property))}
      <div>
        {showOptionals 
          ? Object.entries(optionalProps).map(([propertyName, property]) => renderFields(propertyName, property))
          : (
            <div className='flex items-center justify-center mt-8'>
              <button
                type="button"
                className='inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:text-sm'
                onClick={() => setShowOptionals(oldValue => !oldValue)}
              >
                Advanced Options
              </button>
            </div>
          )}
      </div>
    </form>
  );
};

const TemplateParameters = forwardRef(TemplateParametersSans);
export { TemplateParameters };
