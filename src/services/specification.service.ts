// @ts-ignore
import { convert, ConvertVersion } from '@asyncapi/converter';
import { parse, registerSchemaParser, AsyncAPIDocument } from '@asyncapi/parser';
// @ts-ignore
import openapiSchemaParser from '@asyncapi/openapi-schema-parser';
// @ts-ignore
import avroSchemaParser from '@asyncapi/avro-schema-parser';
// @ts-ignore
import specs from '@asyncapi/specs';
import YAML from 'js-yaml';

import { EditorService } from './editor.service';
import { MonacoService } from './monaco.service';

import state from '../state';

registerSchemaParser(openapiSchemaParser);
registerSchemaParser(avroSchemaParser);

export class SpecificationService {
  static getParsedSpec() {
    return window.ParsedSpec || null;
  }

  static async parseSpec(rawSpec?: string): Promise<AsyncAPIDocument | void> {
    rawSpec = rawSpec || EditorService.getValue() || '';
    const parserState = state.parser;
    const documentFromURL = state.editor.documentFromURL.get();
    let options: any = undefined;
    if (documentFromURL) {
      options = {
        path: documentFromURL,
      };
    }

    return parse(rawSpec, options)
      .then(asyncApiDoc => {
        window.ParsedSpec = asyncApiDoc;
        parserState.set({
          parsedSpec: asyncApiDoc,
          valid: true,
          errors: [],
        });

        const version = asyncApiDoc.version();
        MonacoService.updateLanguageConfig(version);
        if (this.shouldInformAboutLatestVersion(version)) {
          state.spec.set({
            shouldOpenConvertModal: true,
            convertOnlyToLatest: false,
            forceConvert: false,
          });
        }

        EditorService.applyErrorMarkers([]);
        return asyncApiDoc;
      })
      .catch(err => {
        if (typeof rawSpec !== 'string') {
          return;
        }

        try {
          const asyncapiSpec = YAML.load(rawSpec) as { asyncapi: string };
          MonacoService.updateLanguageConfig(asyncapiSpec.asyncapi);
        } catch (e: any) {
          // intentional
        }
        const errors = this.filterErrors(err, rawSpec);

        parserState.set({
          parsedSpec: null,
          valid: false,
          errors,
        });
        EditorService.applyErrorMarkers(errors);
      });
  }

  static async convertSpec(
    spec: string,
    version: ConvertVersion = this.getLastVersion() as ConvertVersion,
  ): Promise<string> {
    try {
      const converted = convert(spec, version);
      if (typeof converted === 'object') {
        return JSON.stringify(converted, undefined, 2);
      }
      return converted;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static getSpecs() {
    return specs;
  }

  static getLastVersion(): string {
    return Object.keys(specs).pop() as string;
  }

  static shouldInformAboutLatestVersion(
    version: string,
  ): boolean {
    const oneDay = 24 * 60 * 60 * 1000; /* ms */

    const nowDate = new Date();
    let dateOfLastQuestion = nowDate;
    const localStorageItem = sessionStorage.getItem('informed-about-latest');
    if (localStorageItem) {
      dateOfLastQuestion = new Date(localStorageItem);
    }

    const isOvertime =
      nowDate === dateOfLastQuestion ||
      nowDate.getTime() - dateOfLastQuestion.getTime() > oneDay;
    if (isOvertime && version !== this.getLastVersion()) {
      sessionStorage.setItem('informed-about-latest', nowDate.toString());
      return true;
    }

    return false;
  }

  static errorHasLocation(err: any) {
    return (
      this.isValidationError(err) ||
      this.isJsonError(err) ||
      this.isYamlError(err) ||
      this.isDereferenceError(err) ||
      this.isUnsupportedVersionError(err)
    );
  }

  private static notSupportedVersions = /('|"|)asyncapi('|"|): ('|"|)(1.0.0|1.1.0|1.2.0|2.0.0-rc1|2.0.0-rc2)('|"|)/;

  private static filterErrors(err: any, rawSpec: string) {
    const errors = [];
    if (this.isUnsupportedVersionError(err)) {
      errors.push({
        type: err.type,
        title: err.message,
        location: err.validationErrors,
      });
      this.isNotSupportedVersion(rawSpec) &&
        state.spec.set({
          shouldOpenConvertModal: true,
          convertOnlyToLatest: false,
          forceConvert: true,
        });
    }
    if (this.isValidationError(err)) {
      errors.push(...err.validationErrors);
    }
    if (this.isYamlError(err) || this.isJsonError(err)) {
      errors.push(err);
    }
    if (this.isDereferenceError(err)) {
      errors.push(
        ...err.refs.map((ref: any) => ({
          type: err.type,
          title: err.title,
          location: { ...ref },
        })),
      );
    }
    if (errors.length === 0) {
      errors.push(err);
    }
    return errors;
  }

  private static isValidationError(err: any) {
    return (
      err &&
      err.type === 'https://github.com/asyncapi/parser-js/validation-errors'
    );
  }

  private static isJsonError(err: any) {
    return (
      err && err.type === 'https://github.com/asyncapi/parser-js/invalid-json'
    );
  }

  private static isYamlError(err: any) {
    return (
      err && err.type === 'https://github.com/asyncapi/parser-js/invalid-yaml'
    );
  }

  private static isUnsupportedVersionError(err: any) {
    return (
      err &&
      err.type === 'https://github.com/asyncapi/parser-js/unsupported-version'
    );
  }

  private static isDereferenceError(err: any) {
    return (
      err &&
      err.type === 'https://github.com/asyncapi/parser-js/dereference-error'
    );
  }

  static isNotSupportedVersion(rawSpec: string): boolean {
    if (this.notSupportedVersions.test(rawSpec.trim())) {
      return true;
    }
    return false;
  }
}
