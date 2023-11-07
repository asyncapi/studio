import create from 'zustand';

export type AppState = {
  initialized: boolean;
  readOnly: boolean;
  liveServer: boolean;
  initErrors: any[],
}

export const appState = create<AppState>(() => ({
  initialized: false,
  readOnly: false,
  liveServer: false,
  initErrors: [],
}));

export const useAppState = appState;