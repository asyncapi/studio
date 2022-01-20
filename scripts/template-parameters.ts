/* eslint-disable security/detect-non-literal-fs-filename */

import fs from 'fs';
import path from 'path';
import { JSONSchema7 } from 'json-schema';

const DESTINATION_JSON = path.join(__dirname, '../src/components/Modals/Generator/template-parameters.json');
const SUPPORTED_TEMPLATES = [
  '@asyncapi/dotnet-nats-template',
  '@asyncapi/go-watermill-template',
  '@asyncapi/html-template',
  '@asyncapi/java-spring-cloud-stream-template',
  '@asyncapi/java-spring-template',
  '@asyncapi/java-template',
  '@asyncapi/markdown-template',
  '@asyncapi/nodejs-template',
  '@asyncapi/nodejs-ws-template',
  '@asyncapi/python-paho-template',
  '@asyncapi/ts-nats-template',
];

interface TemplateParameter {
  description?: string;
  default?: any;
  required?: boolean;
}

interface TemplateConfig {
  parameters: Record<string, TemplateParameter>;
}

function serializeParam(configParam: TemplateParameter): JSONSchema7 {
  const param: JSONSchema7 = {
    description: configParam.description,
  };

  if (typeof configParam.default === 'boolean' || configParam.default === 'true' || configParam.default === 'false') {
    param.type = 'boolean';
    if (typeof configParam.default === 'boolean') {
      param.default = configParam.default;
    } else if (configParam.default === 'true') {
      param.default = true;
    } else if (configParam.default === 'false') {
      param.default = false;
    }
  } else if (typeof configParam.default === 'number') {
    param.type = 'number';
    param.default = Number(configParam.default);
  } else {
    param.type = 'string';
    param.default = configParam.default;
  }

  return param;
}

function serializeTemplateParameters(templateName: string, config: TemplateConfig): JSONSchema7 | undefined {
  if (!config || !config.parameters) {
    return;
  }

  const configParameters = config.parameters;
  const parameters: Record<string, JSONSchema7> = {};
  const required: string[] = [];
  for (const parameter in configParameters) {
    const configParam = configParameters[String(parameter)];

    // temporary skip that parameter because it brokes server-api
    if (parameter === 'singleFile' && templateName === '@asyncapi/html-template') {
      continue;
    }
    const param = serializeParam(configParam);
    if (configParam.required) {
      required.push(parameter);
    }
    
    parameters[String(parameter)] = param;
  }

  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties: parameters,
    required,
    // don't allow non supported properties
    additionalProperties: false,
  } as JSONSchema7;
}

async function main() {
  const schemas: Record<string, JSONSchema7> = {};
  for (let i = 0, l = SUPPORTED_TEMPLATES.length; i < l; i++) {
    const templateName = SUPPORTED_TEMPLATES[Number(i)];

    console.info(`[INFO]: Prepare parameters for ${templateName}.`);

    const pathToPackageJSON = path.join(__dirname, `../node_modules/${templateName}/package.json`);
    const packageJSONContent = await fs.promises.readFile(pathToPackageJSON, 'utf-8');
    const packageJSON = JSON.parse(packageJSONContent);

    const schema = serializeTemplateParameters(templateName, packageJSON.generator);
    if (schema) {
      schemas[String(templateName)] = schema;
    }
  }

  console.info(`[INFO]: Save template parameters schemas to ${DESTINATION_JSON}.`);
  await fs.promises.writeFile(DESTINATION_JSON, JSON.stringify(schemas), 'utf-8');
}
main();
