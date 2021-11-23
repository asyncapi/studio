// @ts-ignore
import { convert } from '@asyncapi/converter';
import { parse, AsyncAPIDocument } from '@asyncapi/parser';
// @ts-ignore
import specs from '@asyncapi/specs';

import { EditorService } from './editor.service';
import { FormatService } from './format.service';
import { MonacoService } from './monaco.service';

import state from '../state';

export class SpecificationService {
  static async parseSpec(rawSpec: string): Promise<AsyncAPIDocument | void> {
    const parserState = state.parser;
    return parse(rawSpec)
      .then(asyncApiDoc => {
        parserState.set({
          parsedSpec: asyncApiDoc,
          valid: true,
          errors: [],
        });

        MonacoService.updateLanguageConfig(asyncApiDoc);
        if (this.shouldInformAboutLatestVersion(asyncApiDoc.version())) {
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

  private static isNotSupportedVersion(rawSpec: string): boolean {
    if (this.notSupportedVersions.test(rawSpec.trim())) {
      return true;
    }
    return false;
  }
}
