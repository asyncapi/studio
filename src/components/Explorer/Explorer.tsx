import { Allotment } from "allotment";

import { Files } from './Files/Files';
import { DocumentStructure } from './DocumentStructure';

import type { FunctionComponent } from 'react';

interface ExplorerProps {}

export const Explorer: FunctionComponent<ExplorerProps> = () => {
  return (
    <div className="flex flex-row relative overflow-y-auto overflow-x-hidden bg-gray-500 h-full w-full">
      <Allotment vertical>
        <Allotment.Pane minSize={200} maxSize={300}>
          <Files />
        </Allotment.Pane>
        <Allotment.Pane snap>
          <DocumentStructure />
        </Allotment.Pane>
      </Allotment>
    </div>
  );
};
