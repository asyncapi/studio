import create from 'zustand';
import { persist } from 'zustand/middleware';

export type SettingsState = {
  editor: {
    autoSaving: boolean;
    savingDelay: number;
    v3support: boolean;
  };
  governance: {
    show: {
      warnings: boolean;
      informations: boolean;
      hints: boolean;
    }
  };
  templates: {
    autoRendering: boolean;
  };
}

export const settingsState = create(
  persist<SettingsState>(() => 
    ({
      editor: {
        autoSaving: true,
        savingDelay: 625,
        v3support: false,
      },
      governance: {
        show: {
          warnings: true,
          informations: true,
          hints: true,
        },
      },
      templates: {
        autoRendering: true,
      },
    }), 
  {
    name: 'studio-settings',
    getStorage: () => localStorage,
  }
  ),
);

export const useSettingsState = settingsState;