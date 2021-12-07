import { createState, useState } from '@hookstate/core';
import { PanelItem } from '../components/Panels/Panels';

export interface PanelsState {
  panels: PanelItem[];
  activePanel: string;
}

export const panelsState = createState<PanelsState>({
  panels: [
    {
      id: 'root-vertical',
      direction: 'vertical',
      panels: ['root-horizontal'],
    },
    {
      id: 'root-horizontal',
      direction: 'horizontal',
      panels: ['panel-1-vertical', 'panel-2-vertical'],
    },
    {
      id: 'panel-1-vertical',
      direction: 'vertical',
      panels: ['panel-1-horizontal'],
      parent: 'root',
    },
    {
      id: 'panel-1-horizontal',
      direction: 'horizontal',
      panels: ['panel-1'],
      parent: 'root',
    },
    {
      id: 'panel-2-vertical',
      direction: 'vertical',
      panels: ['panel-2-horizontal'],
      parent: 'root',
    },
    {
      id: 'panel-2-horizontal',
      direction: 'horizontal',
      panels: ['panel-2'],
      parent: 'root',
    },
    {
      id: 'panel-1',
      parent: 'panel-1',
    },
    {
      id: 'panel-2',
      parent: 'panel-2',
    },
  ],
  activePanel: 'panel-1',
});

export function usePanelsState() {
  return useState(panelsState);
}
