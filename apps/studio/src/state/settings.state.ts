import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SettingsState = {
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
