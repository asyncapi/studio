import { createState, useState } from '@hookstate/core';
import { PanelItem } from '../components/Panels/Panels';

export interface PanelsState {
  panels: PanelItem[];
  activePanel: string;
}

export const panelsState = createState<PanelsState>({
  panels: [
    {
      id: 'root',
      direction: 'vertical',
      panels: ['group-1'],
    },
    {
      id: 'group-1',
      direction: 'horizontal',
      panels: ['panel-1-group', 'panel-2-group'],
    },
    {
      id: 'panel-1-group',
      direction: 'vertical',
      panels: ['panel-1'],
    },
    {
      id: 'panel-2-group',
      direction: 'vertical',
      panels: ['panel-2'],
    },
    {
      id: 'panel-1',
    },
    {
      id: 'panel-2',
    },
  ],
  activePanel: 'panel-1',
});

export function usePanelsState() {
  return useState(panelsState);
}
