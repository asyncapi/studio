import { createState, useState } from '@hookstate/core';

export interface AppState {
  initialized: boolean;
  readOnly: boolean;
  liveServer: boolean,
}

export const appState = createState<AppState>({
  initialized: false,
  readOnly: false,
  liveServer: false,
});

export function useAppState() {
  return useState(appState);
}
