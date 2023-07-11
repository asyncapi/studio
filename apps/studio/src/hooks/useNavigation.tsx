'use client';

import { useEffect } from "react";
import { useEditor } from "./useEditor";
import { useParser } from "./useParser";

export const useNavigation = () => {
  const parserSvc = useParser();
  const editorSvc = useEditor(); 

  useEffect(() => {
    (async () => {
      try {
        await scrollToHash();
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      } catch (err: any) {
        console.error(err);
      }
    })();
  }, [])

  function getUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      url: urlParams.get('url') || urlParams.get('load'),
      base64: urlParams.get('base64'),
      readOnly: urlParams.get('readOnly') === 'true' || urlParams.get('readOnly') === '',
      liveServer: urlParams.get('liveServer'),
      redirectedFrom: urlParams.get('redirectedFrom'),
    };
  }

  async function scrollTo(
    jsonPointer: string | Array<string | number>,
    hash: string,
  ) {
    try {
      const range = parserSvc.getRangeForJsonPath('asyncapi', jsonPointer);
      if (range) {
        await scrollToEditorLine(range.start.line + 1);
      }

      await scrollToHash(hash);
      emitHashChangeEvent(hash);
    } catch (e) {
      console.error(e);
    }
  }

  async function scrollToHash(hash?: string) {
    try {
      const sanitizedHash = sanitizeHash(hash);
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

  async function scrollToEditorLine(line: number, character = 1) {
    try {
      const editor = editorSvc.editor;
      console.log(editor);
      if (editor) {
        editor.revealLineInCenter(line);
        editor.setPosition({ lineNumber: line, column: character });
      }
    } catch (err) {
      console.error(err);
    }
  }

  function highlightVisualiserNode(nodeId: string, setState: React.Dispatch<React.SetStateAction<boolean>>) {
    function hashChanged() {
      if (location.hash.startsWith(nodeId)) {
        setState(true);
        setTimeout(() => {
          setState(false);
        }, 1000);
      }
    }

    window.addEventListener('hashchange', hashChanged);
    return () => {
      window.removeEventListener('hashchange', hashChanged);
    };
  }

  function sanitizeHash(hash?: string): string | undefined {
    hash = hash || window.location.hash.substring(1);
    try {
      const escapedHash = CSS.escape(hash);
      return escapedHash.startsWith('#') ? hash.substring(1) : escapedHash;
    } catch (err: any) {
      return;
    }
  }

  function emitHashChangeEvent(hash: string) {
    hash = hash.startsWith('#') ? hash : `#${hash}`;
    window.history.pushState({}, '', hash);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }

  return {
    getUrlParameters,
    scrollTo,
    scrollToEditorLine,
    scrollToHash,
    highlightVisualiserNode,
  }
}