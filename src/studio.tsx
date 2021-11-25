import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

import { Content, Sidebar, Template, Toolbar } from './components';
import { ConvertToLatestModal } from './components/Modals';
import { NavigationService } from './services';

export interface AsyncAPIStudioProps {}

const AsyncAPIStudio: React.FunctionComponent<AsyncAPIStudioProps> = () => {
  useEffect(() => {
    NavigationService.onInitApp();
  }, []);

  if (NavigationService.isReadOnly(true)) {
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
      <ConvertToLatestModal />
    </div>
  );
};

export default AsyncAPIStudio;
