import { useEffect } from 'react';

import { AsyncAPIStudio } from './studio';
import { onAfterAppInit } from './services';

import type { FunctionComponent } from 'react';

let appInit = false;
async function onInit() {
  if (appInit) {
    return;
  }
  appInit = true;
  await onAfterAppInit();
}

export const App: FunctionComponent = () => {
  useEffect(() => {
    onInit();
  }, []);

  return (
    <AsyncAPIStudio />
  );
};
