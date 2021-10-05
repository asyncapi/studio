// @ts-ignore
import { convert } from '@asyncapi/converter';
import { parse, AsyncAPIDocument } from '@asyncapi/parser';
// @ts-ignore
import specs from '@asyncapi/specs';

import { FormatService } from './format.service';
import { MonacoService } from './monaco.service';

import state from '../state';

export class SpecificationService {
  static async parseSpec(rawSpec: string): Promise<AsyncAPIDocument | void> {
    const parserState = state.parser;
    return parse(rawSpec)
      .then(asyncApiDoc => {
        parserState.parsedSpec.set(asyncApiDoc);
        parserState.valid.set(true);
        parserState.errors.set([]);

        MonacoService.updateLanguageConfig(asyncApiDoc);
        if (this.shouldInformAboutLatestVersion(asyncApiDoc.version())) {
          state.spec.set({
            shouldOpenConvertModal: true,
            forceConvertToLatest: false,
          })
        }

        return asyncApiDoc;
      })
      .catch(err => {
        const errors = this.filterErrors(err, rawSpec);
        parserState.parsedSpec.set(null);
        parserState.valid.set(false);
        parserState.errors.set(errors);
      });
  }

  static async convertSpec(
    spec: string,
    version: string = this.getLastVersion(),
  ): Promise<string> {
    const language = FormatService.retrieveLangauge(spec);
    try {
      const convertedSpec = convert(spec, version);
      return language === 'json'
        ? FormatService.convertToJSON(convertedSpec)
        : convertedSpec;
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

  static errorHasLocation(err: any) {
    return (
      this.isValidationError(err) ||
      this.isJsonError(err) ||
      this.isYamlError(err) ||
      this.isDereferenceError(err) ||
      this.isUnsupportedVersionError(err)
    );
  }

  static isValidationError(err: any) {
    return (
      err &&
      err.type === 'https://github.com/asyncapi/parser-js/validation-errors'
    );
  }

  static isJsonError(err: any) {
    return (
      err && err.type === 'https://github.com/asyncapi/parser-js/invalid-json'
    );
  }

  static isYamlError(err: any) {
    return (
      err && err.type === 'https://github.com/asyncapi/parser-js/invalid-yaml'
    );
  }

  static isUnsupportedVersionError(err: any) {
    return (
      err &&
      err.type === 'https://github.com/asyncapi/parser-js/unsupported-version'
    );
  }

  static isDereferenceError(err: any) {
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

  private static notSupportedVersions = /('|"|)asyncapi('|"|): ('|"|)(1.0.0|1.1.0|1.2.0|2.0.0-rc1|2.0.0-rc2)('|"|)/;

  private static filterErrors(err: any, rawSpec: string) {
    let errors = [];
    if (this.isUnsupportedVersionError(err)) {
      errors.push({
        type: err.type,
        title: err.message,
        location: err.validationErrors,
      });
      this.isNotSupportedVersion(rawSpec) &&
        state.spec.set({
          shouldOpenConvertModal: true,
          forceConvertToLatest: false,
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
}
