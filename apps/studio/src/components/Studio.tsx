'use client';

import React from 'react';
import Toolbar from './Toolbar';

export interface AsyncAPIStudioProps {}

export const AsyncAPIStudio: React.FunctionComponent<AsyncAPIStudioProps> = () => {


  return (
    <div className="flex flex-col w-full h-screen">
      <Toolbar />
    </div>
  );
};
