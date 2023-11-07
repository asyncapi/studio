/* eslint-disable security/detect-non-literal-fs-filename */

import fs from 'fs';
import path from 'path';
import { JSONSchema7 } from 'json-schema';

const DESTINATION_JSON = path.join(__dirname, '../src/components/Modals/Generator/template-parameters.json');
const TEMPLATES: Record<string, string> = {
  '@asyncapi/dotnet-nats-template': '.NET Nats Project',
  '@asyncapi/go-watermill-template': 'GO Lang Watermill Project',
  '@asyncapi/html-template': 'HTML website',
  '@asyncapi/java-spring-cloud-stream-template': 'Java Spring Cloud Stream Project',
  '@asyncapi/java-spring-template': 'Java Spring Project',
  '@asyncapi/java-template': 'Java Project',
  '@asyncapi/markdown-template': 'Markdown Documentation',
  '@asyncapi/nodejs-template': 'NodeJS Project',
  '@asyncapi/nodejs-ws-template': 'NodeJS WebSocket Project',
  '@asyncapi/python-paho-template': 'Python Paho Project',
  '@asyncapi/ts-nats-template': 'Typescript Nats Project',
};
const SUPPORTED_TEMPLATES = Object.keys(TEMPLATES);

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

function serializeTemplateParameters(config: TemplateConfig): JSONSchema7 | undefined {
  if (!config || !config.parameters) {
    return;
  }

  const configParameters = config.parameters;
  const parameters: Record<string, JSONSchema7> = {};
  const required: string[] = [];
  for (const parameter in configParameters) {
    const configParam = configParameters[String(parameter)];
    
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
  const schemas: Record<string, {
    title: string,
    schema: JSONSchema7,
    supportedProtocols: string[],
  }> = {};
  for (let i = 0, l = SUPPORTED_TEMPLATES.length; i < l; i++) {
    const templateName = SUPPORTED_TEMPLATES[Number(i)];

    console.info(`[INFO]: Prepare parameters for ${templateName}.`);

    const pathToPackageJSON = path.join(__dirname, `../../../node_modules/${templateName}/package.json`);
    const packageJSONContent = await fs.promises.readFile(pathToPackageJSON, 'utf-8');
    const packageJSON = JSON.parse(packageJSONContent);
    const generatorConfig = packageJSON.generator;

    const schema = serializeTemplateParameters(generatorConfig);
    if (schema) {
      schemas[String(templateName)] = {
        title: TEMPLATES[String(templateName)],
        schema,
        supportedProtocols: generatorConfig.supportedProtocols,
      };
    }
  }

  console.info(`[INFO]: Save template parameters schemas to ${DESTINATION_JSON}.`);
  await fs.promises.writeFile(DESTINATION_JSON, JSON.stringify(schemas), 'utf-8');
}
main();
