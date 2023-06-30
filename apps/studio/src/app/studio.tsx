'use client'

import React from 'react';
// import { Toaster } from 'react-hot-toast';

import { Toolbar } from '../components';

// import { afterAppInit, useServices } from '../services';
// import { appState } from '../state';

export interface AsyncAPIStudioProps {}

export const AsyncAPIStudio: React.FunctionComponent<AsyncAPIStudioProps> = () => {
  // const services = useServices();

  // useEffect(() => {
  //   setTimeout(() => {
  //     afterAppInit(services).catch(console.error);
  //   }, 250);
  // }, []);

  // if (appState.getState().readOnly) {
  //   return (
  //     <div className="flex flex-row flex-1 overflow-hidden w-full h-screen">
  //       <Template />
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col w-full h-screen">
      <Toolbar />
      {/* <div className="flex flex-row flex-1 overflow-hidden">
        <Sidebar />
        <Content />
      </div>
      <Toaster position="bottom-center" reverseOrder={false} /> */}
    </div>
  );
};
