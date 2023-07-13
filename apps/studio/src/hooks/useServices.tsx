'use client';

import { createContext, useState } from "react";
import { useEditor, useFormat, useParser, useNavigation } from ".";
import { useContext } from "react";

import type * as monacoAPI from 'monaco-editor/esm/vs/editor/editor.api';

export type ServiceContextType = {
  editorSvc: ReturnType<typeof useEditor>;
  formatSvc: ReturnType<typeof useFormat>;
  parserSvc: ReturnType<typeof useParser>;
  navigationSvc: ReturnType<typeof useNavigation>;
}

export type ServiceProps = {
  editor: monacoAPI.editor.IStandaloneCodeEditor | undefined;
}

const ServiceContext = createContext<ServiceContextType>({} as ServiceContextType);

export const useServices = () => useContext(ServiceContext);

export const ServiceProvider = ({ children }: { children: React.ReactNode }) => {
  const [ editor, setEditor ] = useState<monacoAPI.editor.IStandaloneCodeEditor | undefined>();

  const props = {
    editor,
  }

  const services = {
    editorSvc: useEditor({ ...props, setEditor}),
    formatSvc: useFormat(props),
    parserSvc: useParser(props),
    navigationSvc: useNavigation(props),
  };

  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
}