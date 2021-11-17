import React, { useEffect } from 'react';

import AsyncAPIStudio from './studio';

const App: React.FunctionComponent = () => {
  useEffect(() => {
    const preloader = document.getElementsByClassName('preloader').item(0);
    if (preloader) {
      preloader.classList.add('loaded');
    }
  }, []);

  return (
    <AsyncAPIStudio />
  );
};

export default App;
