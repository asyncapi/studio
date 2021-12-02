import { createState, useState } from '@hookstate/core';

function loadSettings(): SettingsState {
  let settings: string | null | SettingsState = localStorage.getItem('studio-settings');
  if (settings) {
    return JSON.parse(settings) as SettingsState;
  }

  settings = {
    editor: {
      autoSaving: true,
      savingDelay: 625,
    },
    templates: {
      autoRendering: true,
    },
  };
  localStorage.setItem('studio-settings', JSON.stringify(settings));
  return settings;
}
const savedSettings = loadSettings();

export interface SettingsState {
  templates: {
    autoRendering: boolean;
  },
  editor: {
    autoSaving: boolean;
    savingDelay: number;
  }
}

export const settingsState = createState<SettingsState>({
  editor: {
    autoSaving: savedSettings.editor?.autoSaving || true,
    savingDelay: savedSettings.editor?.savingDelay || 625,
  },
  templates: {
    autoRendering: savedSettings.templates?.autoRendering || true,
  },
});

export function useSettingsState() {
  return useState(settingsState);
}
