import React from 'react';

import { Visualiser } from './Visualiser';
import { TemplateSidebar } from '../Template/TemplateSidebar';

interface VisualiserTemplateProps {}

export const VisualiserTemplate: React.FunctionComponent<VisualiserTemplateProps> = () => {
  return (
    <div className="flex flex-1 flex-col h-full overflow-hidden">
      <TemplateSidebar />
      <Visualiser />
    </div>
  );
};
