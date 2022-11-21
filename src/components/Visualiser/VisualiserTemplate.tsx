import { Visualiser } from './Visualiser';
import { TemplateSidebar } from '../Template/TemplateSidebar';

import type { FunctionComponent } from 'react';

interface VisualiserTemplateProps {}

export const VisualiserTemplate: FunctionComponent<VisualiserTemplateProps> = () => {
  return (
    <div className="flex flex-1 flex-col h-full overflow-hidden">
      <TemplateSidebar />
      <Visualiser />
    </div>
  );
};
