// @ts-ignore
import { Markdown as MarkdownComponent } from '@asyncapi/react-component/lib/cjs/components/Markdown';

import type { FunctionComponent, PropsWithChildren } from 'react';

export const Markdown: FunctionComponent<PropsWithChildren> = ({ 
  children,
}) => {
  return (
    <div className='aui-root'>
      <MarkdownComponent>
        {children}
      </MarkdownComponent>
    </div>
  );
};
