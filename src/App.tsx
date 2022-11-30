import { useEffect } from 'react';
import { show } from '@ebay/nice-modal-react';

import { AsyncAPIStudio } from './studio';
import { RedirectedModal } from './components/Modals';

import state from './state';

import type { FunctionComponent } from 'react';

async function onInit(editorLoaded: boolean, redirectedFrom: string | false) {
  if (!editorLoaded) {
    return;
  }

  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('loaded');
  }

  if (typeof redirectedFrom === 'string') {
    show(RedirectedModal);
  }
}

export const App: FunctionComponent = () => {
  const appState = state.useAppState();
  const editorState = state.useEditorState();

  const redirectedFrom = appState.redirectedFrom.get();
  const editorLoaded = editorState.editorLoaded.get();

  useEffect(() => {
    onInit(editorLoaded, redirectedFrom);
  }, [editorLoaded, redirectedFrom]); // eslint-disable-line

  return (
    <AsyncAPIStudio />
  );
};
