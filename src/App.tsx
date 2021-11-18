import React, { useEffect } from 'react';

import AsyncAPIStudio from './studio';

import state from './state';

const App: React.FunctionComponent = () => {
  const editorState = state.useEditorState();
  const editorLoaded = editorState.editorLoaded.get();

  useEffect(() => {
    if (editorLoaded === true) {
      const preloader = document.getElementById('preloader');
      if (preloader) {
        preloader.classList.add('loaded');
      }
    }
  }, [editorLoaded]); // eslint-disable-line

  return (
    <AsyncAPIStudio />
  );
};

export default App;
