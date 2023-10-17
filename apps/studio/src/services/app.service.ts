import { AbstractService } from './abstract.service';

import { show } from '@ebay/nice-modal-react';

import { RedirectedModal } from '../components/Modals';

import { appState, filesState } from '../state';
import { File } from '../state/files.state';

export class ApplicationService extends AbstractService {
  override async onInit() {
    // subscribe to state to hide preloader
    this.hidePreloader();

    const { readOnly, url, base64 } = this.svcs.navigationSvc.getUrlParameters();
    // readOnly state should be only set to true when someone pass also url or base64 parameter
    const isStrictReadonly = Boolean(readOnly && (url || base64));

    let error: any; 
    try {
      const file = await this.fetchFile(url, base64);
      if (file) {
        this.updateFile(file);
      }
    } catch (err) {
      error = err;
      console.error(err);
    }

    if (isStrictReadonly && !error) {
      appState.setState({
        readOnly,
        initialized: true,
      });
    }
  }

  public async afterAppInit() {
    const { readOnly, url, base64, redirectedFrom } = this.svcs.navigationSvc.getUrlParameters();
    const isStrictReadonly = Boolean(readOnly && (url || base64));

    // show RedirectedModal modal if the redirectedFrom is set (only when readOnly state is set to false)
    if (!isStrictReadonly && redirectedFrom) {
      show(RedirectedModal);
    }
  }

  private async fetchFile(url: string | null, base64: string | null): Promise<Partial<File> | null> {
    if (url) {
      return {
        content: await fetch(url).then((res) => res.text()),
        source: url,
        from: 'url',
      };
    }
    if (base64) {
      return {
        content: this.svcs.formatSvc.decodeBase64(base64),
        from: 'base64',
      };
    }
    const res = await Promise.any([
      fetch('/docs/asyncapi/asyncapi.yaml'),
      fetch('/docs/asyncapi/asyncapi.json'),
    ]);
    if (res.status === 200) {
      return res.text().then((content) => ({ content }));
    }
    return null;
  }

  private async updateFile(file: Partial<File>) {
    const { updateFile } = filesState.getState();
    const { source, content = '' } = file;
    const language = this.svcs.formatSvc.retrieveLangauge(content);
    updateFile('asyncapi', { ...file, language });
    await this.svcs.parserSvc.parse('asyncapi', content, { source });
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