import { AbstractService } from './abstract.service';

import { show } from '@ebay/nice-modal-react';

// import { RedirectedModal } from '../components/Modals';

import { appState, filesState } from '../states';

export class ApplicationService extends AbstractService {
  override async onInit() {
    // subscribe to state to hide preloader
    this.hidePreloader();

    // const { readOnly, url, base64 } = this.svcs.navigationSvc.getUrlParameters();
    const { readOnly, url, base64 } = { readOnly: false, url: null, base64: null };
    // readOnly state should be only set to true when someone pass also url or base64 parameter
    const isStrictReadonly = Boolean(readOnly && (url || base64));

    let error: any; 
    try {
      await this.fetchResource(url, base64);
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
    // const { readOnly, url, base64, redirectedFrom } = this.svcs.navigationSvc.getUrlParameters();
    const { readOnly, url, base64, redirectedFrom } = { readOnly: false, url: null, base64: null, redirectedFrom: null };
    const isStrictReadonly = Boolean(readOnly && (url || base64));

    // show RedirectedModal modal if the redirectedFrom is set (only when readOnly state is set to false)
    if (!isStrictReadonly && redirectedFrom) {
      // show(RedirectedModal);
    }
  }

  private async fetchResource(url: string | null, base64: string | null) {
    if (!url && !base64) {
      return;
    }
    
    const { updateFile } = filesState.getState();
    let content = '';
    if (url) {
      content = await fetch(url).then(res => res.text());
    } else if (base64) {
      // content = this.svcs.formatSvc.decodeBase64(base64);
    }

    // const language = this.svcs.formatSvc.retrieveLangauge(content);
    const source = url || undefined;
    updateFile('asyncapi', {
      content,
      language: 'yaml',
      source,
      from: url ? 'url' : 'base64',
    });
    // await this.svcs.parserSvc.parse('asyncapi', content, { source });
  }

  private hidePreloader() {
    appState.setState({
      initialized: true,
    });
  }
}