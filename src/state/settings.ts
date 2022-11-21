import { createState, useState } from '@hookstate/core';

function loadSettings(): SettingsState {
  let settings: string | null | SettingsState = localStorage.getItem('studio-settings');
  let possibleSettings: SettingsState | undefined;
  if (settings) {
    possibleSettings = JSON.parse(settings) as SettingsState;
  }

  const editor = possibleSettings?.editor || {} as SettingsState['editor'];
  const governanceShow = possibleSettings?.governance?.show || {} as SettingsState['governance']['show'];
  const templates = possibleSettings?.templates || {} as SettingsState['templates'];

  settings = {
    showModal: false,
    activeTab: 'Editor',
    editor: {
      autoSaving: 'autoSaving' in editor ? editor.autoSaving : true,
      savingDelay: 'savingDelay' in editor ? editor.savingDelay : 625,
    },
    governance: {
      show: {
        warnings: 'warnings' in governanceShow ? governanceShow.warnings : true,
        informations: 'informations' in governanceShow ? governanceShow.informations : true,
        hints: 'hints' in governanceShow ? governanceShow.hints : true,
      },
    },
    templates: {
      autoRendering: 'autoRendering' in templates ? templates.autoRendering : true,
    },
  };
  localStorage.setItem('studio-settings', JSON.stringify(settings));
  return settings;
}

export interface SettingsState {
  showModal: boolean;
  activeTab: string;
  editor: {
    autoSaving: boolean;
    savingDelay: number;
  },
  governance: {
    show: {
      warnings: boolean,
      informations: boolean,
      hints: boolean,
    }
  }
  templates: {
    autoRendering: boolean;
  },
}

export const settingsState = createState<SettingsState>(loadSettings());

export function useSettingsState() {
  return useState(settingsState);
}
