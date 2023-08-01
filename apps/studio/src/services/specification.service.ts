import { AbstractService } from './abstract.service';

import specs from '@asyncapi/specs';
import { show } from '@ebay/nice-modal-react';

import { ConvertToLatestModal } from '../components/Modals';

import { documentsState, settingsState } from '../state';

import type { SpecVersions } from '../types';

export class SpecificationService extends AbstractService {
  private betaVersion = false;
  private keySessionStorage = 'informed-about-latest';
  override onInit() {
    this.subcribeToDocuments();
    this.subscribeToSettings();
  }

  get specs() {
    return specs.schemas;
  }

  get latestVersion(): SpecVersions {
    return this.betaVersion ?
      Object.keys(this.specs).pop() as SpecVersions :
      Object.keys(this.specs).at(-2) as SpecVersions;
  }

  updateBetaVersion(enable: boolean): void {
    this.betaVersion = enable;
  }

  getSpec(version: SpecVersions) {
    return this.specs[String(version) as SpecVersions];
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

  private subscribeToSettings() {
    settingsState.subscribe((state, prevState) => {
      if (state.editor.v3support === prevState.editor.v3support) return;
      const { editor: { v3support } } = settingsState.getState();
      this.updateBetaVersion(v3support);
      sessionStorage.removeItem(this.keySessionStorage);
    });
  }

  private tryInformAboutLatestVersion(
    version: string,
  ): boolean {
    const oneDay = 24 * 60 * 60 * 1000; /* ms */

    const nowDate = new Date();
    let dateOfLastQuestion = nowDate;
    const localStorageItem = sessionStorage.getItem(this.keySessionStorage);
    if (localStorageItem) {
      dateOfLastQuestion = new Date(localStorageItem);
    }

    const isOvertime =
      nowDate === dateOfLastQuestion ||
      nowDate.getTime() - dateOfLastQuestion.getTime() > oneDay;
    if (isOvertime && version !== this.latestVersion) {
      sessionStorage.setItem(this.keySessionStorage, nowDate.toString());
      return true;
    }

    return false;
  }
}