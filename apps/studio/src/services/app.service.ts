import { AbstractService } from './abstract.service';

import { show } from '@ebay/nice-modal-react';

import { RedirectedModal } from '../components/Modals';

import { debugLog } from '@/helpers/debug';
import { appState, filesState } from '@/state';

function inferResourceLanguage(content: string, sourceUri: string): 'json' | 'yaml' | 'markdown' {
  const lowerUri = sourceUri.toLowerCase();
  if (lowerUri.endsWith('.md') || lowerUri.endsWith('.markdown')) {
    return 'markdown';
  }

  return content.trimStart().startsWith('{') ? 'json' : 'yaml';
}

function isAsyncApiContent(content: string): boolean {
  const trimmed = String(content).trim();
  if ((/^asyncapi\s*:/m).test(trimmed)) {
    return true;
  }

  if (!trimmed.startsWith('{')) {
    return false;
  }

  try {
    return !!JSON.parse(trimmed).asyncapi;
  } catch {
    return false;
  }
}

function getProjectRoot(url: string | null): string | undefined {
  if (!url) {
    return undefined;
  }

  try {
    return new URL(url).host;
  } catch {
    return 'Remote Files';
  }
}

function getResourceOrigin(base64: string | null, share: string | null): 'url' | 'base64' | 'share' {
  if (base64) {
    return 'base64';
  }

  if (share) {
    return 'share';
  }

  return 'url';
}

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

    const sourceUri = url || (share ? `share://${share}` : 'base64://document');
    const detectedLanguage = this.svcs.formatSvc.retrieveLangauge(content);
    const language = detectedLanguage === 'json'
      ? 'json'
      : inferResourceLanguage(content, sourceUri);
    const source = url || undefined;
    const from = getResourceOrigin(base64, share);
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
      isAsyncApiDocument: isAsyncApiContent(content),
    };
    const projectRoot = getProjectRoot(url);
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
