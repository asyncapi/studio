import { createState, useState } from '@hookstate/core';

export interface AppState {
  initialized: boolean;
}

export const appState = createState<AppState>({
  initialized: false,
});

export function useAppState() {
  return useState(appState);
}
