import { createState, useState } from '@hookstate/core';

import { Orientation } from '../components/Split/sash';
import { Panel } from '../services';

export interface PanelsState {
  panels: Panel[];
  activePanel: string;
}

export const panelsState = createState<PanelsState>({
  panels: [
    {
      id: 'root',
      direction: Orientation.Vertical,
      panels: ['group-1'],
    },
    {
      id: 'group-1',
      direction: Orientation.Horizontal,
      panels: ['panel-1-group', 'panel-2-group'],
    },
    {
      id: 'panel-1-group',
      direction: Orientation.Vertical,
      panels: ['panel-1'],
    },
    {
      id: 'panel-2-group',
      direction: Orientation.Vertical,
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
