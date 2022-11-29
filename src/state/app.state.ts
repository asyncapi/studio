import create from 'zustand'

export type AppState = {
  initialized: boolean;
  readOnly: boolean;
  liveServer: boolean;
  redirectedFrom: string | false;
}

export const appState = create<AppState>(_ => ({
  initialized: false,
  readOnly: false,
  liveServer: false,
  redirectedFrom: false,
}));

export const useAppState = appState;