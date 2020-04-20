import AsyncapiParser from '@asyncapi/parser'

export function parse(asyncapiString) {
  return AsyncapiParser.parse(asyncapiString, {
    path: 'https://assets.asyncapi.local',
    resolve: {
      file: false,
    },
    dereference: {
      circular: 'ignore',
    }
  })
}

export function errorHasLocation(err) {
  return isValidationError(err)
    || isJsonError(err)
    || isYamlError(err)
    || isDereferenceError(err)
    || isUnsupportedVersionError(err);
}

export function isValidationError(err) {
  return err && err.type === 'https://github.com/asyncapi/parser-js/validation-errors';
}

export function isJsonError(err) {
  return err && err.type === 'https://github.com/asyncapi/parser-js/invalid-json';
}

export function isYamlError(err) {
  return err && err.type === 'https://github.com/asyncapi/parser-js/invalid-yaml';
}

export function isUnsupportedVersionError(err) {
  return err && err.type === 'https://github.com/asyncapi/parser-js/unsupported-version';
}

export function isDereferenceError(err) {
  return err && err.type === 'https://github.com/asyncapi/parser-js/dereference-error';
}
