import React from 'react';
import { JSONSchema7 } from 'json-schema';

import { Switch } from '../../common';

interface TemplateParametersProps {
  templateName: string;
  template: JSONSchema7;
}

export const TemplateParameters: React.FunctionComponent<TemplateParametersProps> = ({
  templateName, 
  template,
}) => {
  const { properties, required } = template; 

  return (
    <form>

    </form>
  );
};
