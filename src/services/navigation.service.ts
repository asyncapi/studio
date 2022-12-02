import { AbstractService } from './abstract.service';

export class NavigationService extends AbstractService {
  getUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      url: urlParams.get('url') || urlParams.get('load'),
      base64: urlParams.get('base64'),
      readOnly: urlParams.get('readOnly') === 'true' || urlParams.get('readOnly') === '',
      liveServer: urlParams.get('liveServer'),
      redirectedFrom: urlParams.get('redirectedFrom'),
    };
  }

  async scrollTo(
    jsonPointer: string | Array<string | number>,
    hash: string,
  ) {
    try {
      const range = this.svcs.parserSvc.getRangeForJsonPath('asyncapi', jsonPointer);
      if (range) {
        this.scrollToEditorLine(range.start.line + 1);
      }

      this.scrollToHash(hash);
      this.emitHashChangeEvent(hash);
    } catch (e) {
      console.error(e);
    }
  }

  async scrollToHash(hash?: string) {
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

  private emitHashChangeEvent(hash: string) {
    hash = hash.startsWith('#') ? hash : `#${hash}`;
    window.history.pushState({}, '', hash);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }
}
