import { createState, useState } from '@hookstate/core';

export interface SidebarState {
  show: boolean;
  panels: {
    navigation: boolean;
    editor: boolean;
    template: boolean;
  };
}

export const sidebarState = createState<SidebarState>({
  show: true,
  panels: {
    navigation: true,
    editor: true,
    template: true,
  },
});

export function useSidebarState() {
  return useState(sidebarState);
}
