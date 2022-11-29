import { createContext, useContext } from 'react';

import { EditorService } from './editor.service';
import { FormatService } from './format.service';
import { MonacoService } from './monaco.service';
import { NavigationService } from './navigation.service';
import { ServerAPIService } from './server-api.service';
import { SocketClient } from './socket-client.service';
import { SpecificationService } from './specification.service';

export type Services = {
  editorSvc: EditorService;
  formatSvc: FormatService;
  monacoSvc: MonacoService;
  navigationSvc: NavigationService;
  serverAPISvc: ServerAPIService;
  socketClientSvc: SocketClient;
  specificationSvc: SpecificationService;
}

const servicesCtx = createContext<Services>({} as Services);

export function useServices() {
  return useContext(servicesCtx);
}

export const ServicesProvider = servicesCtx.Provider;

export async function createServices() {
  const services: Services = {} as Services;

  services.editorSvc = new EditorService(services);
  services.formatSvc = new FormatService(services);
  services.monacoSvc = new MonacoService(services);
  services.navigationSvc = new NavigationService(services);
  services.serverAPISvc = new ServerAPIService(services);
  services.socketClientSvc = new SocketClient(services);
  services.specificationSvc = new SpecificationService(services);

  for (const service in services) {
    await services[service as keyof Services].onInit();
  }

  return services;
}

export * from './editor.service';
export * from './format.service';
export * from './monaco.service';
export * from './navigation.service';
export * from './server-api.service';
export * from './socket-client.service';
export * from './specification.service';