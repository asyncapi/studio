import { createContext, useContext } from 'react';

import { ApplicationService } from './app.service';
import { ConverterService } from './converter.service';
import { DocumentsService } from './documents.service';
import { EditorService } from './editor.service';
import { EventEmitterService } from './event-emitter.service';
import { FilesService } from './files/files.service';
import { FormatService } from './format.service';
import { MonacoService } from './monaco.service';
import { NavigationService } from './navigation.service';
import { PanelsService } from './panels.service';
import { ParserService } from './parser.service';
import { ServerAPIService } from './server-api.service';
import { SettingsService } from './settings.service';
import { SocketClient } from './socket-client.service';
import { SpecificationService } from './specification.service';

import type StrictEventEmitter from 'strict-event-emitter-types';
import type { EventKinds } from '../types';

export type Services = {
  appSvc: ApplicationService;
  converterSvc: ConverterService;
  documentsSvc: DocumentsService;
  editorSvc: EditorService;
  eventsSvc: StrictEventEmitter<EventEmitterService, EventKinds>;
  filesSvc: FilesService;
  formatSvc: FormatService;
  monacoSvc: MonacoService;
  navigationSvc: NavigationService;
  panelsSvc: PanelsService;
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

  /**
   * First create most needed services
   */
  services.appSvc = new ApplicationService(services);
  services.eventsSvc = new EventEmitterService(services);
  services.monacoSvc = new MonacoService(services);
  services.editorSvc = new EditorService(services);

  services.converterSvc = new ConverterService(services);
  services.documentsSvc = new DocumentsService(services);
  services.filesSvc = new FilesService(services);
  services.formatSvc = new FormatService(services);
  services.navigationSvc = new NavigationService(services);
  services.panelsSvc = new PanelsService(services);
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
