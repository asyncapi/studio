'use client';

import { useEffect } from 'react';
import Toolbar from './Toolbar';
import Content from './Content';
import { Sidebar } from './Sidebar';
import { Toaster } from 'react-hot-toast';
// import { Template } from './Template';
import { appState } from '../state';
import { afterAppInit, useServices } from '../services';

export interface AsyncAPIStudioProps {}

export const AsyncAPIStudio: React.FC<AsyncAPIStudioProps> = () => {
  const services = useServices();

  useEffect(() => {
    setTimeout(() => {
      afterAppInit(services).catch(console.error);
    }, 250);
  }, []);

  // if (appState.getState().readOnly) {
  //   return (
  //     <div className="flex flex-row flex-1 overflow-hidden w-full h-screen">
  //       <Template /> -- Gives canvas error
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col w-full h-screen">
      <Toolbar />
      <div className="flex flex-row flex-1 overflow-hidden">
        <Sidebar />
        <Content />
      </div>
      <Toaster position="bottom-center" reverseOrder={false} />
    </div>
  );
};