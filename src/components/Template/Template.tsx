import React from 'react';

import { TemplateSidebar } from './TemplateSidebar';
import { HTMLWrapper } from './HTMLWrapper';

import { useServices } from '../../services';

import { appState } from '../../state/index.state';

interface TemplateProps {}

export const Template: React.FunctionComponent<TemplateProps> = () => {
  const { navigationSvc } = useServices();

  return (
    <div className="flex flex-1 flex-col h-full overflow-hidden">
      {!appState.getState().readOnly && <TemplateSidebar />}
      <HTMLWrapper />
    </div>
  );
};
