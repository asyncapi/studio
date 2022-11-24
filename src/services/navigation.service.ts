import { AbstractService } from './abstract.service';

import { EditorService } from './editor.service';
import { SocketClient } from './socket-client.service';
import { SpecificationService } from './specification.service';
import state from '../state';

export class NavigationService extends AbstractService {
  static async scrollTo(
    jsonPointer: any,
    hash: string,
  ) {
    try {
      const range = SpecificationService.getRangeForJsonPath(jsonPointer);
      if (range) {
        this.scrollToEditorLine(range.start.line + 1);
      }

      this.scrollToHash(hash);
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

  static async scrollToEditorLine(line: number, character = 1) {
    try {
      const editor = window.Editor;
      if (editor) {
        editor.revealLineInCenter(line);
        editor.setPosition({ lineNumber: line, column: character });
      }
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
    const redirectedFrom = urlParams.get('redirectedFrom');

    if (liveServerPort && typeof Number(liveServerPort) === 'number') {
      SocketClient.connect(window.location.hostname, liveServerPort);
    } else if (documentUrl) {
      await EditorService.importFromURL(documentUrl);
    } else if (base64Document) {
      await EditorService.importBase64(base64Document);
    }

    const isReadonly = this.isReadOnly(true);
    if (isReadonly) {
      await SpecificationService.parseSpec(state.editor.editorValue.get());
      state.sidebar.show.set(false);
      state.editor.merge({
        monacoLoaded: true,
        editorLoaded: true,
      });
    }

    state.app.merge({
      readOnly: isReadonly,
      initialized: true,
      redirectedFrom: redirectedFrom || false,
    });
  }

  private static emitHashChangeEvent(hash: string) {
    hash = hash.startsWith('#') ? hash : `#${hash}`;
    window.history.pushState({}, '', hash);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }
}
