'use client';

import React from 'react';
import dynamic from "next/dynamic";
const MonacoEditor = dynamic(() => import("react-monaco-editor"), { ssr: false });
import Toolbar from './Toolbar';
import { Editor } from './Editor';
import Content from './Content';

export interface AsyncAPIStudioProps {}

export const AsyncAPIStudio: React.FunctionComponent<AsyncAPIStudioProps> = () => {
  const [postBody, setPostBody] = React.useState("");

  return (
    <div className="flex flex-col w-full h-screen">
      <Toolbar />
      <Content />
    </div>
  );
};