import React from 'react';
import { Toaster } from 'react-hot-toast';

import { Content, Sidebar, Toolbar } from './components';
import { ConvertToLatestModal } from './components/Modals';

export interface AsyncAPIStudioProps {}

const AsyncAPIStudio: React.FunctionComponent<AsyncAPIStudioProps> = () => {
  return (
    <div className="flex flex-col h-full w-full h-screen">
      <Toolbar />
      <div className="flex flex-row flex-1 overflow-hidden">
        <Sidebar />
        <Content />
      </div>
      <Toaster position="bottom-center" reverseOrder={false} />
      <ConvertToLatestModal />
    </div>
  );
};

export default AsyncAPIStudio;
