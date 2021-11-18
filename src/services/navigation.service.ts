// @ts-ignore
import { getLocationOf } from '@asyncapi/parser/lib/utils';

import { EditorService } from './editor.service';
import { SocketClient } from './socket-client.service';
import { SpecificationService } from './specification.service';
import state from '../state';

interface LocationOf {
  jsonPointer: string;
  startLine: number;
  startColumn: number;
  startOffset: number;
  endLine?: number;
  endColumn?: number;
  endOffset?: number;
}

export class NavigationService {
  static async scrollTo(
    jsonPointer: any,
    spec: any,
    hash: string,
    language = 'yaml',
  ) {
    try {
      const location: LocationOf = getLocationOf(jsonPointer, spec, language);
      if (!location || typeof location.startLine !== 'number') {
        return;
      }

      this.scrollToHash(hash);
      this.scrollToEditorLine(location.startLine);
      this.emitHashChangeEvent(hash);
    } catch (e) {
      console.error(e);
    }
  }

  static async scrollToHash(hash?: string) {
    hash = hash || window.location.hash.substring(1);
    try {
      const escapedHash = CSS.escape(hash);
      if (!escapedHash || escapedHash === '#') {
        return;
      }

      const items = document.querySelectorAll(
        escapedHash.startsWith('#') ? escapedHash : `#${escapedHash}`,
      );
      if (items.length) {
        const element = items[0];
        typeof element.scrollIntoView === 'function' &&
          element.scrollIntoView();
      }
    } catch (err) {
      console.error(err);
    }
  }

  static async scrollToEditorLine(startLine: number, columnLine = 1) {
    try {
      const editor = window.Editor;
      editor && editor.revealLineInCenter(startLine);
      editor && editor.setPosition({ lineNumber: startLine, column: columnLine });
    } catch (err) {
      console.error(err);
    }
  }

  static isReadOnly(strict = false) {
    const urlParams = new URLSearchParams(window.location.search);
    const isReadonly = urlParams.get('readOnly') === 'true' || urlParams.get('readOnly') === ''
      ? true
      : false;

    if (strict === false) {
      return isReadonly;
    }
    return isReadonly && !!(urlParams.get('url') || urlParams.get('load') || urlParams.get('base64'));
  }

  static async onInitApp() {
    const urlParams = new URLSearchParams(window.location.search);

    const documentUrl = urlParams.get('url') || urlParams.get('load');
    const base64Document = urlParams.get('base64');
    const liveServerPort = urlParams.get('liveServer');

    if (liveServerPort && typeof Number(liveServerPort) === 'number') {
      SocketClient.connect(window.location.hostname, liveServerPort);
    } else if (documentUrl) {
      await EditorService.importFromURL(documentUrl);
    } else if (base64Document) {
      await EditorService.importBase64(base64Document);
    }

    if (this.isReadOnly(true)) {
      await SpecificationService.parseSpec(state.editor.editorValue.get());
      state.sidebar.show.set(false);
      state.editor.set({
        ...state.editor.get(),
        monacoLoaded: true,
        editorLoaded: true,
      });
    }
    state.app.initialized.set(true);
  }

  private static emitHashChangeEvent(hash: string) {
    hash = hash.startsWith('#') ? hash : `#${hash}`;
    window.history.pushState({}, '', hash);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }
}
