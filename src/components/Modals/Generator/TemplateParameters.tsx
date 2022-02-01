import React, { useState, useCallback, useImperativeHandle, forwardRef, useEffect, useMemo } from 'react';
import { JSONSchema7 } from 'json-schema';

import { Switch } from '../../common';

import state from '../../../state';

interface TemplateParameterProps {
  propertyName: string;
  property: JSONSchema7;
  setValue: (propertyName: string, value: any) => void;
}

const StringParameter: React.FunctionComponent<TemplateParameterProps> = ({
  propertyName, 
  property,
  setValue,
}) => {
  if (property.enum) {
    return (
      <select
        name="template"
        className="shadow-sm focus:ring-pink-500 focus:border-pink-500 w-1/2 block sm:text-sm rounded-md py-1 text-gray-700 border-pink-300 border-2"
        onChange={e => setValue(propertyName, e.target.value)}
      >
        <option value="">Please select server</option>
        {property.enum.map(serverName => (
          <option key={serverName as string} value={serverName as string}>
            {serverName}
          </option>
        ))}
      </select>
    );
  }

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
  supportedProtocols: string[];
  setConfirmDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TemplateParametersSans: React.ForwardRefRenderFunction<TemplateParametersHandle, React.PropsWithChildren<TemplateParametersProps>> = ({
  templateName,
  template: { properties = {}, required = [] },
  supportedProtocols = [],
  setConfirmDisabled,
}, templateParamsRef) => {
  const [values, setValues] = useState<Record<string, any>>({});
  const [showOptionals, setShowOptionals] = useState<boolean>(false);
  const parserState = state.useParserState();
  const parsedSpec = parserState.parsedSpec.get()!;

  const { requiredProps, optionalProps, hasSupportedProtocols } = useMemo(() => {
    const requiredProperties: Record<string, JSONSchema7> = {};
    const optionalProperties: Record<string, JSONSchema7> = {};
    let hasSupportedProtocols: boolean = true;

    const servers = parsedSpec.servers();
    const availableServers: string[] = [];
    Object.entries(servers).map(([serverName, server]) => {
      if (supportedProtocols.includes(server.protocol())) availableServers.push(serverName);
    });

    if (supportedProtocols.length && availableServers.length === 0) {
      hasSupportedProtocols = false;
      setConfirmDisabled(true);
    } else {
      Object.keys(properties).forEach(propKey => {
        if (propKey === 'server') {
          // @ts-ignore 
          const jsonProperty = { ...properties[String(propKey)] };
          // @ts-ignore 
          jsonProperty.enum = availableServers;
          // @ts-ignore
          requiredProperties[String(propKey)] = jsonProperty;
        }
        // @ts-ignore
        else if (required.includes(propKey)) requiredProperties[String(propKey)] = properties[String(propKey)];
        // @ts-ignore
        else optionalProperties[String(propKey)] = properties[String(propKey)];
      });
    }

    return { requiredProps: requiredProperties, optionalProps: optionalProperties, hasSupportedProtocols };
  }, [properties, required, parsedSpec]);

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

  const renderFields = useCallback((propertyName: string, property: JSONSchema7) => {
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
          <ParameterItem propertyName={propertyName} property={property} setValue={setValue} />
        </div>
        <div className='text-gray-400 text-xs mt-1'>
          {property.description}
        </div>
      </div>
    );
  }, [templateName]);

  if (parsedSpec === null) {
    return null;
  }

  if (!templateName) {
    return (
      <div className='text-sm text-gray-700 mt-10'>
        Please select type of generation
      </div>
    );
  }

  if (!hasSupportedProtocols) {
    return (
      <div className='text-sm text-gray-700 mt-10 text-center'>
        AsyncAPI document doesn't have at least one server with supported protocols. For the selected generation, these are supported: {supportedProtocols.join(', ')}
      </div>
    );
  }

  if (!properties || !Object.keys(properties).length) {
    return (
      <div className='text-sm text-gray-700 mt-10'>
        {'The given generation hasn\'t parameters to pass'}
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
