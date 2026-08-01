/* global globalThis */

import { AbstractService } from './abstract.service';
import { filesState } from '@/state';

import type React from 'react';

export class NavigationService extends AbstractService {
  private unsubscribeFiles?: () => void;

  override onInit() {
    this.subscribeToFiles();
  }

  override async afterAppInit() {
    try {
      await this.scrollToHash();
      globalThis.dispatchEvent(new HashChangeEvent('hashchange'));
    } catch (err: any) {
      console.error(err);
    }
  }

  getUrlParameters() {
    const urlParams = new URLSearchParams(globalThis.location.search);
    return {
      url: urlParams.get('url') || urlParams.get('load'),
      base64: urlParams.get('base64'),
      share: urlParams.get('share'),
      readOnly: urlParams.get('readOnly') === 'true' || urlParams.get('readOnly') === '',
      liveServer: urlParams.get('liveServer'),
      previewServer: urlParams.get('previewServer'),
      redirectedFrom: urlParams.get('redirectedFrom'),
    };
  }

  async scrollTo(
    jsonPointer: string | Array<string | number>,
    hash?: string,
  ) {
    try {
      const doc = this.svcs.editorSvc;
      const content = String(doc.value || '');
      const methodType = content.startsWith('asyncapi') ? 'getRangeForYamlPath' : 'getRangeForJsonPath';
      const range = this.svcs.parserSvc[methodType]('asyncapi', jsonPointer);
      
      if (range) {
        await this.scrollToEditorLine(range.start.line+1);
      }

      await this.scrollToHash(hash);
      if (hash) {
        this.emitHashChangeEvent(hash);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async scrollToHash(hash?: string) {
    try {
      const sanitizedHash = this.sanitizeHash(hash);
      if (!sanitizedHash) {
        return;
      }

      const items = document.querySelectorAll(`#${sanitizedHash}`);
      if (items.length) {
        const element = items[0];
        typeof element.scrollIntoView === 'function' &&
          element.scrollIntoView();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async scrollToEditorLine(line: number, character = 1) {
    try {
      const editor = this.svcs.editorSvc.editor;
      if (editor) {
        editor.revealLineInCenter(line);
        editor.setPosition({ lineNumber: line, column: character });
      }
    } catch (err) {
      console.error(err);
    }
  }

  highlightVisualiserNode(nodeId: string, setState: React.Dispatch<React.SetStateAction<boolean>>) {
    function hashChanged() {
      if (location.hash.startsWith(nodeId)) {
        setState(true);
        setTimeout(() => {
          setState(false);
        }, 1000);
      }
    }

    globalThis.addEventListener('hashchange', hashChanged);
    return () => {
      globalThis.removeEventListener('hashchange', hashChanged);
    };
  }

  private sanitizeHash(hash?: string): string | undefined {
    hash = hash || globalThis.location.hash.substring(1);
    try {
      const escapedHash = CSS.escape(hash);
      return escapedHash.startsWith('#') ? hash.substring(1) : escapedHash;
    } catch (err: any) {
      return;
    }
  }

  private emitHashChangeEvent(hash: string) {
    hash = hash.startsWith('#') ? hash : `#${hash}`;
    globalThis.history.pushState({}, '', hash);
    globalThis.dispatchEvent(new HashChangeEvent('hashchange'));
  }

  destroy() {
    this.unsubscribeFiles?.();
  }

  private subscribeToFiles() {
    this.unsubscribeFiles?.();

    this.unsubscribeFiles = filesState.subscribe((state, prevState) => {
      const currentFile = state.files['asyncapi'];
      const previousFile = prevState.files['asyncapi'];

      if (!currentFile || !previousFile) {
        return;
      }

      if (currentFile.from === previousFile.from) {
        return;
      }

      if (previousFile.from === 'url' && currentFile.from !== 'url') {
        this.removeRemoteUrlParams();
      }
    });
  }

  private removeRemoteUrlParams() {
    const [baseWithPath, hash] = globalThis.location.href.split('#');
    const [base, query] = baseWithPath.split('?');

    if (!query) {
      return;
    }

    const segments = query.split('&').filter(Boolean);
    const keptSegments = segments.filter((part) => {
      return part !== 'url' &&
        !part.startsWith('url=') &&
        part !== 'load' &&
        !part.startsWith('load=');
    });

    const nextUrl = keptSegments.length > 0
      ? `${base}?${keptSegments.join('&')}`
      : base;

    const urlWithHash = hash ? `${nextUrl}#${hash}` : nextUrl;
    globalThis.history.replaceState({}, '', urlWithHash);
  }
}
