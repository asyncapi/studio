import { AbstractService } from './abstract.service';

import { show } from '@ebay/nice-modal-react';

import { RedirectedModal } from '../components/Modals';

import { appState } from '../state';

export class ApplicationService extends AbstractService {
  public override onInit(): void {
    // subscribe to state to hide preloader
    this.hidePreloader();

    const { readOnly, url, base64, redirectedFrom } = this.svcs.navigationSvc.getUrlParameters();

    // readOnly state should be only set to true when someone pass also url or base64 parameter
    const isStrictReadonly = Boolean(readOnly && (url || base64));
    if (isStrictReadonly) {
      appState.setState({
        readOnly,
        initialized: true,
      });
    }

    // show RedirectedModal modal if the redirectedFrom is set (only when readOnly state is set to false)
    if (!isStrictReadonly && redirectedFrom) {
      show(RedirectedModal);
    }
  }

  private hidePreloader() {
    const unsunscribe = appState.subscribe((state, prevState) => {
      if (!prevState.initialized && state.initialized) {
        const preloader = document.getElementById('preloader');
        if (preloader) {
          preloader.classList.add('loaded');
          setTimeout(() => {
            preloader.remove();
          }, 350);
          unsunscribe();
        }
      }
    });
  }
}