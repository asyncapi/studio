import { createContext, useContext } from 'react';

import { ConverterService } from './converter.service';
import { EditorService } from './editor.service';
import { FormatService } from './format.service';
import { MonacoService } from './monaco.service';
import { NavigationService } from './navigation.service';
import { ParserService } from './parser.service';
import { ServerAPIService } from './server-api.service';
import { SettingsService } from './settings.service';
import { SocketClient } from './socket-client.service';
import { SpecificationService } from './specification.service';

export type Services = {
  converterSvc: ConverterService;
  editorSvc: EditorService;
  formatSvc: FormatService;
  monacoSvc: MonacoService;
  navigationSvc: NavigationService;
  parserSvc: ParserService;
  serverAPISvc: ServerAPIService;
  settingsSvc: SettingsService;
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

  services.converterSvc = new ConverterService(services);
  services.editorSvc = new EditorService(services);
  services.formatSvc = new FormatService(services);
  services.monacoSvc = new MonacoService(services);
  services.navigationSvc = new NavigationService(services);
  services.parserSvc = new ParserService(services);
  services.serverAPISvc = new ServerAPIService(services);
  services.settingsSvc = new SettingsService(services);
  services.socketClientSvc = new SocketClient(services);
  services.specificationSvc = new SpecificationService(services);

  for (const service in services) {
    await services[service as keyof Services].onInit();
  }

  return services;
}
