import { Allotment } from "allotment";

import { Sidebar } from './Sidebar';
import { MonacoWrapper } from '../Editor/MonacoWrapper';

import { Terminal } from '../Terminal';

import type { FunctionComponent } from 'react';

interface PrimaryPanelProps {}

export const PrimaryPanel: FunctionComponent<PrimaryPanelProps> = () => {
  return (
    // <div className="flex flex-1 overflow-hidden">
    <div className="flex flex-col relative overflow-hidden bg-gray-500 h-full w-full">
      <Sidebar />
      <Allotment vertical>
        <Allotment.Pane>
          <div className="flex flex-col overflow-hidden h-full">
            <MonacoWrapper />
          </div>
        </Allotment.Pane>
        <Allotment.Pane snap>
          <Terminal />
        </Allotment.Pane>
      </Allotment>
    </div>
  );
};
