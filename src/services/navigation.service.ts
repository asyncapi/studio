// @ts-ignore
import { getLocationOf } from '@asyncapi/parser/lib/utils';

import { EditorService } from './editor.service';
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
  static createBase64Link(base64Document: string) {
    return window.location.origin + '/?base64=' + base64Document;
  }

  static scrollTo(
    jsonPointer: any,
    spec: any,
    hash: string,
    language: string = 'yaml',
  ) {
    try {
      const location: LocationOf = getLocationOf(jsonPointer, spec, language);
      if (!location || typeof location.startLine !== 'number') {
        return;
      }

      this.scrollToHash(hash);
      this.scrollToEditorLine(location.startLine);
      this.emitHashChangeEvent(hash);
    } catch (e) {}
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
    } catch (e) {}
  }

  static scrollToEditorLine(startLine: number) {
    try {
      const editor = window.Editor;
      editor && editor.revealLineInCenter(startLine);
      editor && editor.setPosition({ column: 1, lineNumber: startLine });
    } catch (err) {}
  }

  private static emitHashChangeEvent(hash: string) {
    hash = hash.startsWith('#') ? hash : `#${hash}`;
    window.history.pushState({}, '', hash);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }

  static isReadOnly() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('readOnly') || urlParams.get('readOnly') === ''
      ? true
      : false;
  }

  static async onInit() {
    const urlParams = new URLSearchParams(window.location.search);

    const documentUrl = urlParams.get('url');
    const base64Document = urlParams.get('base64');
    const readonly = this.isReadOnly();

    if (!documentUrl && !base64Document) {
      state.app.initialized.set(true);
      return;
    }

    if (documentUrl) {
      await EditorService.importFromURL(documentUrl);
    } else if (base64Document) {
      await EditorService.importBase64(base64Document);
    }

    if (readonly) {
      await SpecificationService.parseSpec(state.editor.editorValue.get());
      state.sidebar.show.set(false);
      state.sidebar.panels.editor.set(false);
      state.editor.monacoLoaded.set(true);
      state.editor.editorLoaded.set(true);
    }
    state.app.initialized.set(true);
  }
}
