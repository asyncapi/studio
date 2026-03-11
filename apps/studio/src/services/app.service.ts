import { AbstractService } from './abstract.service';

import { show } from '@ebay/nice-modal-react';

import { RedirectedModal } from '../components/Modals';

import { debugLog } from '@/helpers/debug';
import { appState, filesState } from '@/state';

export class ApplicationService extends AbstractService {
  override async onInit() {
    // subscribe to state to hide preloader
    this.hidePreloader();

    const { readOnly, url, base64, share } =
      this.svcs.navigationSvc.getUrlParameters();
    // readOnly state should be only set to true when someone pass also url or base64 or share parameter
    const isStrictReadonly = Boolean(readOnly && (url || base64 || share));

    let error: any;
    try {
      await this.fetchResource(url, base64, share);
    } catch (err) {
      error = err;
      console.error(err);
    }

    if (error) {
      appState.setState({ initErrors: [error] });
    }

    if (isStrictReadonly && !error) {
      appState.setState({
        readOnly,
        initialized: true,
      });
    }
  }

  public async afterAppInit() {
    const { readOnly, url, base64, share, redirectedFrom } =
      this.svcs.navigationSvc.getUrlParameters();
    const isStrictReadonly = Boolean(readOnly && (url || base64 || share));

    // show RedirectedModal modal if the redirectedFrom is set (only when readOnly state is set to false)
    if (!isStrictReadonly && redirectedFrom) {
      show(RedirectedModal);
    }
  }

  private async fetchResource(url: string | null, base64: string | null, share: string | null) {
    if (!url && !base64 && !share) {
      return;
    }

    debugLog('app', 'fetchResource', { url, base64: !!base64, share });

    let content = '';
    if (url) {
      content = await fetch(url).then((res) => res.text());
    } else if (base64) {
      content = this.svcs.formatSvc.decodeBase64(base64);
    } else if (share) {
      const response = await fetch(`/share/${share}`);
      const data = await response.json();
      content = data.content;
    }

    const detectedLanguage = this.svcs.formatSvc.retrieveLangauge(content);
    const sourceUri = url || (share ? `share://${share}` : 'base64://document');
    const lowerUri = sourceUri.toLowerCase();
    let language: 'json' | 'yaml' | 'markdown' = 'yaml';
    if (lowerUri.endsWith('.md') || lowerUri.endsWith('.markdown')) {
      language = 'markdown';
    } else if (detectedLanguage === 'json') {
      language = 'json';
    }
    const source = url || undefined;
    let from: 'url' | 'base64' | 'share' = 'url';
    if (base64) {
      from = 'base64';
    } else if (share) {
      from = 'share';
    }
    const uri = sourceUri;
    const file = {
      uri,
      name: uri.split('/').pop() || uri,
      content,
      language,
      source,
      from,
      modified: false,
      stat: { mtime: Date.now() },
      isAsyncApiDocument: (/^asyncapi\s*:/m).test(String(content).trim()) || (String(content).trim().startsWith('{') && (() => {
        try {
          return !!JSON.parse(String(content)).asyncapi;
        } catch {
          return false;
        }
      })()),
    };
    const projectRoot = url ? (() => {
      try {
        return new URL(url).host;
      } catch {
        return 'Remote Files';
      }
    })() : undefined;
    filesState.getState().setProjectFiles(
      { [uri]: file },
      { activeFileUri: uri, fileTreeMode: url ? 'remote' : 'none', projectRoot },
    );
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
