import { useState, useCallback, useImperativeHandle, forwardRef, useEffect, useMemo } from 'react';
import { JSONSchema7 } from 'json-schema';

import { Switch } from '../../common';

import { useDocumentsState } from '../../../state';

import type { FunctionComponent, ForwardRefRenderFunction, PropsWithChildren, Dispatch, SetStateAction } from 'react';

interface TemplateParameterProps {
  propertyName: string;
  property: JSONSchema7;
  isRequired: boolean;
  setValue: (propertyName: string, value: any, isRequired: boolean) => void;
}

const StringParameter: FunctionComponent<TemplateParameterProps> = ({
  propertyName, 
  property,
  isRequired,
  setValue,
}) => {
  if (property.enum) {
    return (
      <select
        name="template"
        className="shadow-sm focus:ring-pink-500 focus:border-pink-500 w-1/2 block sm:text-sm rounded-md py-1 text-gray-700 border-pink-300 border-2"
        onChange={e => setValue(propertyName, e.target.value, isRequired)}
      >
        <option value="">Please select server</option>
        {property.enum.map(serverName => (
          <option key={serverName as string} value={serverName as string}>
            {serverName as string}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      name={propertyName}
      className="shadow-sm focus:ring-pink-500 focus:border-pink-500 w-1/2 block sm:text-sm rounded-md p-1 text-gray-700 border-pink-300 border-2"
      onChange={e => setValue(propertyName, e.target.value, isRequired)}
    />
  );
};

const NumberParameter = StringParameter;

const BooleanParameter: FunctionComponent<TemplateParameterProps> = ({
  propertyName,
  property,
  isRequired,
  setValue
}) => {
  return (
    <Switch
      toggle={property.default as boolean}
      onChange={(v) => setValue(propertyName, v, isRequired)}
    />
  );
};

const ParameterItem: FunctionComponent<TemplateParameterProps> = (props) => {
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
  setConfirmDisabled: Dispatch<SetStateAction<boolean>>;
}

export const TemplateParametersSans: ForwardRefRenderFunction<TemplateParametersHandle, PropsWithChildren<TemplateParametersProps>> = ({
  templateName,
  template: { properties = {}, required = [] },
  supportedProtocols = [],
  setConfirmDisabled,
}, templateParamsRef) => {
  const [values, setValues] = useState<Record<string, any>>({});
  const [showOptionals, setShowOptionals] = useState<boolean>(false);
  const document = useDocumentsState(state => state.documents['asyncapi']?.document);

  const { requiredProps, optionalProps, hasSupportedProtocols } = useMemo(() => {
    const requiredProperties: Record<string, JSONSchema7> = {};
    const optionalProperties: Record<string, JSONSchema7> = {};
    let hasSupportedProto = true;

    const servers = document?.servers();
    const availableServers: string[] = [];
    Object.entries(servers || {}).forEach(([serverName, server]) => {
      if (supportedProtocols.includes(server.protocol())) availableServers.push(serverName);
    });

    if (supportedProtocols.length && availableServers.length === 0) {
      hasSupportedProto = false;
      setConfirmDisabled(true);
    } else {
      Object.keys(properties).forEach(propKey => {
        if (propKey === 'server') {
          // @ts-ignore 
          const jsonProperty = { ...properties[String(propKey)] };
          jsonProperty.enum = availableServers;
          requiredProperties[String(propKey)] = jsonProperty;
        } else if (required.includes(propKey)) {
          // @ts-ignore
          requiredProperties[String(propKey)] = properties[String(propKey)];
        } else {
          // @ts-ignore
          optionalProperties[String(propKey)] = properties[String(propKey)];
        }
      });
    }

    return { requiredProps: requiredProperties, optionalProps: optionalProperties, hasSupportedProtocols: hasSupportedProto };
  }, [properties, required, document]);

  useEffect(() => {
    setValues({});
    setShowOptionals(false);
  }, [templateName, setValues, setShowOptionals]);

  useImperativeHandle(templateParamsRef, () => ({
    getValues() {
      return values;
    }
  }));

  const setValue = useCallback((propertyName: string, value: any, isRequired: boolean) => {
    setValues(oldValues => {
      oldValues[String(propertyName)] = String(value);
      if (isRequired) {
        const disableConfirm = required.some(r => !oldValues[String(r)]);
        setConfirmDisabled(disableConfirm);
      }
      return oldValues;
    });
  }, [required]);

  const renderFields = useCallback((propertyName: string, property: JSONSchema7, isRequired: boolean, isFirst: boolean) => {
    return (
      <div key={`${templateName}${propertyName}`} className={`flex flex-col text-sm ${isFirst ? 'mt-1' : 'mt-4'}`}>
        <div className="flex flex-row content-center justify-between">
          <label
            htmlFor={propertyName}
            className="flex justify-right items-center w-1/2 content-center font-medium text-gray-700"
          >
            <span>
              {propertyName}
            </span>
          </label>
          <ParameterItem propertyName={propertyName} property={property} isRequired={isRequired} setValue={setValue} />
        </div>
        <div className='text-gray-400 text-xs mt-1'>
          {property.description}
        </div>
      </div>
    );
  }, [templateName]);

  if (document === null) {
    return null;
  }

  if (!templateName) {
    return null;
  }

  if (!hasSupportedProtocols) {
    return (
      <div className='text-sm text-gray-700 mt-10 text-center'>
        AsyncAPI document doesn&apos;t have at least one server with supported protocols. For the selected generation, these are supported: {supportedProtocols.join(', ')}
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
      {Object.keys(requiredProps).length > 0 && (
        <div className='mt-8'>
          <h5 className='text-sm text-gray-400'>
            Required options
          </h5>
          <div>
            {Object.entries(requiredProps).map(([propertyName, property], idx) => renderFields(propertyName, property, true, idx === 0))}
          </div>
        </div>
      )}
      {Object.keys(optionalProps).length > 0 && (
        <div className='mt-8'>
          <div className='flex flex-row justify-between'>
            <h5 className='text-sm text-gray-400'>
              Advanced options (optional)
            </h5>
            <button type='button' className='text-sm underline text-pink-500' onClick={() => setShowOptionals(oldValue => !oldValue)}>
              {showOptionals ? 'Hide advanced options' : 'Show advanced options'}
            </button>
          </div>
          {showOptionals && (
            <div>
              {Object.entries(optionalProps).map(([propertyName, property], idx) => renderFields(propertyName, property, false, idx === 0))}
            </div>
          )}
        </div>
      )}
    </form>
  );
};

const TemplateParameters = forwardRef(TemplateParametersSans);
export { TemplateParameters };
