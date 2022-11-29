import create from 'zustand';
import { persist } from 'zustand/middleware';

export type PanelsState = {
  show: {
    activityBar: boolean;
    statusBar: boolean;
    primarySidebar: boolean;
    secondarySidebar: boolean;
    primaryPanel: boolean;
    secondaryPanel: boolean;
    contextPanel: boolean;
  };
  // TODO: remove when panels tabs will be introduced
  secondaryPanelType: 'template' | 'visualiser';
  newFileOpened: boolean;
}

export const panelsState = create(
  persist<PanelsState>(_ => 
    ({
      show: {
        activityBar: true,
        statusBar: true,
        primarySidebar: true,
        secondarySidebar: true,
        primaryPanel: true,
        secondaryPanel: true,
        contextPanel: true,
      },
      secondaryPanelType: 'template',
      newFileOpened: false,
    }), 
    {
      name: 'studio-panels',
      getStorage: () => localStorage,
    }
  ),
);

export const usePanelsState = panelsState;