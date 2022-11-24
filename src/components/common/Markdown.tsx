import type { FunctionComponent, PropsWithChildren } from 'react';

// @ts-ignore
import { Markdown as MarkdownComponent } from '@asyncapi/react-component/lib/esm/components/Markdown';

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
