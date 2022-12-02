import React from 'react';
import { Toaster } from 'react-hot-toast';

import { Content, Sidebar, Template, Toolbar } from './components';

import { appState } from './state';

export interface AsyncAPIStudioProps {}

export const AsyncAPIStudio: React.FunctionComponent<AsyncAPIStudioProps> = () => {
  if (appState.getState().readOnly) {
    return (
      <div className="flex flex-row flex-1 overflow-hidden h-full w-full h-screen">
        <Template />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full h-screen">
      <Toolbar />
      <div className="flex flex-row flex-1 overflow-hidden">
        <Sidebar />
        <Content />
      </div>
      <Toaster position="bottom-center" reverseOrder={false} />
    </div>
  );
};
