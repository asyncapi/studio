// @ts-ignore
import { getLocationOf } from '@asyncapi/parser/lib/utils';

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
  static scrollTo(
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

  static scrollToHash(hash?: string) {
    hash = hash || window.location.hash.substring(1);
    try {
      const escapedHash = CSS.escape(hash);
      const items = document.querySelectorAll(
        escapedHash.startsWith('#') ? escapedHash : `#${escapedHash}`,
      );
      if (items.length) {
        const element = items[0];
        typeof element.scrollIntoView === 'function' &&
          element.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      console.error(err);
    }
  }

  static scrollToEditorLine(startLine: number) {
    try {
      const editor = window.Editor;
      editor && editor.revealLineInCenter(startLine);
      editor && editor.setPosition({ column: 1, lineNumber: startLine });
    } catch (err) {
      console.error(err);
    }
  }

  private static emitHashChangeEvent(hash: string) {
    hash = hash.startsWith('#') ? hash : `#${hash}`;
    window.history.pushState({}, '', hash);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }
}
