import { AbstractService } from './abstract.service';

import specs from '@asyncapi/specs';

import type { SpecVersions } from '../types';

export class SpecificationService extends AbstractService {
  get specs() {
    return specs;
  }

  get latestVersion(): SpecVersions {
    return Object.keys(specs).pop() as SpecVersions;
  }

  getSpec(version: SpecVersions) {
    return specs[version];
  }

  tryInformAboutLatestVersion(
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
    if (isOvertime && version !== this.latestVersion) {
      sessionStorage.setItem('informed-about-latest', nowDate.toString());
      return true;
    }

    return false;
  }
}