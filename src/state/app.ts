import { createState, useState } from '@hookstate/core';

export interface AppState {
  initialized: boolean;
  readOnly: boolean;
  liveServer: boolean;
  redirectedFrom: string | false;
}

export const appState = createState<AppState>({
  initialized: false,
  readOnly: false,
  liveServer: false,
  redirectedFrom: false,
});

export function useAppState() {
  return useState(appState);
}
