'use client'

import { createContext, useContext } from 'react';
import { ApplicationService } from './app.service';


export type Services = {
  appSvc: ApplicationService;
}

const servicesCtx = createContext<Services>({} as Services);

export function useServices() {
  return useContext(servicesCtx);
}

export const ServicesProvider = servicesCtx.Provider;

export async function createServices() {
  const services: Services = {} as Services;

  services.appSvc = new ApplicationService();

  for (const service in services) {
    await services[service as keyof Services].onInit();
  }

  return services;
}

export async function afterAppInit(services: Services) {
  for (const service in services) {
    await services[service as keyof Services].afterAppInit();
  }
}
