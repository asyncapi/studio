import create from 'zustand';

export type AppState = {
  initialized: boolean;
  readOnly: boolean;
  liveServer: boolean;
}

export const appState = create<AppState>(() => ({
  initialized: false,
  readOnly: false,
  liveServer: false,
}));

export const useAppState = appState;