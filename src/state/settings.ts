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

function createSettings(): SettingsState {
  const savedSettings = loadSettings();

  return {
    editor: {
      autoSaving: typeof savedSettings.editor?.autoSaving === 'boolean' ? savedSettings.editor?.autoSaving : true,
      savingDelay: savedSettings.editor?.savingDelay || 625,
    },
    templates: {
      autoRendering: typeof savedSettings.templates?.autoRendering === 'boolean' ? savedSettings.templates?.autoRendering : true,
    },
  };
}

export interface SettingsState {
  templates: {
    autoRendering: boolean;
  },
  editor: {
    autoSaving: boolean;
    savingDelay: number;
  }
}

export const settingsState = createState<SettingsState>(createSettings());

export function useSettingsState() {
  return useState(settingsState);
}
