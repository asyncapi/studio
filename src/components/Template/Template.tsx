import React from 'react';

import { TemplateSidebar } from './TemplateSidebar';
import { HTMLWrapper } from './HTMLWrapper';

import { NavigationService } from '../../services';

interface TemplateProps {}

export const Template: React.FunctionComponent<TemplateProps> = () => {
  return (
    <div className="flex flex-1 flex-col h-full overflow-hidden">
      {!NavigationService.isReadOnly(true) && <TemplateSidebar />}
      <HTMLWrapper />
    </div>
  );
};
