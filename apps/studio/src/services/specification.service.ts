import { AbstractService } from './abstract.service';

import specs from '@asyncapi/specs';
import { show } from '@ebay/nice-modal-react';

import { ConvertToLatestModal } from '../components/Modals';

import { documentsState } from '../state';

import type { SpecVersions } from '../types';

export class SpecificationService extends AbstractService {
  override onInit() {
    this.subcribeToDocuments();
  }

  get specs() {
    return specs;
  }

  get latestVersion(): SpecVersions {
    return Object.keys(specs).pop() as SpecVersions;
  }

  getSpec(version: SpecVersions) {
    return specs[String(version) as SpecVersions];
  }

  private subcribeToDocuments() {
    documentsState.subscribe((state, prevState) => {
      const newDocuments = state.documents;
      const oldDocuments = prevState.documents;

      Object.entries(newDocuments).forEach(([uri, document]) => {
        const oldDocument = oldDocuments[String(uri)];
        if (document === oldDocument) return;
        const version = document.document?.version();
        if (version && this.tryInformAboutLatestVersion(version)) {
          show(ConvertToLatestModal);
        }
      });
    });
  }

  private tryInformAboutLatestVersion(
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