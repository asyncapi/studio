import { Allotment } from "allotment";

import { Files } from './Files/Files';
import { DocumentStructure } from './DocumentStructure';

import type { FunctionComponent } from 'react';

interface ExplorerProps {}

export const Explorer: FunctionComponent<ExplorerProps> = () => {
  return (
    <div className="flex flex-row relative overflow-y-auto overflow-x-hidden bg-gray-800 h-full w-full">
      <Allotment vertical>
        <Allotment.Pane minSize={200}>
          <Files />
        </Allotment.Pane>
        <Allotment.Pane snap>
          <DocumentStructure />
        </Allotment.Pane>
      </Allotment>
    </div>
  );
};
