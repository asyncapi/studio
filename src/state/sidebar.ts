import { createState, useState } from '@hookstate/core';

export interface SidebarState {
  show: boolean;
  activePanel: 'explorer' | 'tools' | 'templates' | false;
  panels: {
    newFile: boolean;
    navigation: boolean;
    tools: boolean;
    templates: boolean;
    editor: boolean;
    view: boolean;
    viewType: 'template' | 'visualiser';
  };
}

export const sidebarState = createState<SidebarState>({
  show: true,
  activePanel: 'explorer',
  panels: {
    newFile: false,
    navigation: true,
    tools: false,
    templates: false,
    editor: true,
    view: true,
    viewType: 'template',
  },
});

export function useSidebarState() {
  return useState(sidebarState);
}
