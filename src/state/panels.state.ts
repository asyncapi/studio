import create from 'zustand';
import { persist } from 'zustand/middleware';

export type PanelTabCore = {
  id: string;
  panel: string;
  type: string;
}

export type EditorTab = {
  type: 'editor';
  uri: string;
} & PanelTabCore;

export type PanelTab = 
  | EditorTab;

export type Panel = {
  id: string;
  tabs: Array<PanelTab>;
  activeTab: string;
}

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
  panels: Record<string, Panel>;
  // TODO: remove when panels tabs will be introduced
  secondaryPanelType: 'template' | 'visualiser';
}

export const panelsState = create(
  persist<PanelsState>(() => 
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
      panels: {
        primary: {
          id: 'primary',
          activeTab: 'file:///asyncapi',
          tabs: [
            {
              id: 'file:///asyncapi',
              panel: 'primary',
              type: 'editor',
              uri: 'file:///asyncapi',
            }
          ],
        },
      },
      secondaryPanelType: 'template',
    }), 
    {
      name: 'studio-panels',
      getStorage: () => localStorage,
    }
  ),
);

export const usePanelsState = panelsState;