import React from 'react';

import { TemplateSidebar } from './TemplateSidebar';
import { HTMLWrapper } from './HTMLWrapper';
import { MarkdownPreview } from './MarkdownPreview';
import { AvroPreview } from './AvroPreview';

import { appState } from '../../state';
import { useFilesState } from '@/state';

interface TemplateProps {}

export const Template: React.FunctionComponent<TemplateProps> = () => {
  const activeFile = useFilesState((state) => state.files['asyncapi']);
  const isMarkdownFile = Boolean(
    activeFile?.language === 'markdown' ||
    activeFile?.uri?.toLowerCase().endsWith('.md') ||
    activeFile?.uri?.toLowerCase().endsWith('.markdown'),
  );
  const isAvroFile = Boolean(activeFile?.uri?.toLowerCase().endsWith('.avsc'));
  let previewPanel = <HTMLWrapper />;
  if (isAvroFile) {
    previewPanel = <AvroPreview />;
  } else if (isMarkdownFile) {
    previewPanel = <MarkdownPreview content={activeFile?.content || ''} />;
  }

  return (
    <div className="flex flex-1 flex-col h-full overflow-hidden">
      {!appState.getState().readOnly && <TemplateSidebar />}
      {previewPanel}
    </div>
  );
};
