import React, { useMemo } from 'react';

import { useFilesState } from '@/state';

import { MarkdownPreview } from './MarkdownPreview';
import { buildAvroDiagramMarkdown } from './avro-diagram';

export const AvroPreview: React.FunctionComponent = () => {
  const { file, files } = useFilesState((state) => ({
    file: state.files['asyncapi'],
    files: state.files,
  }));

  const markdown = useMemo(() => {
    return buildAvroDiagramMarkdown(file, files);
  }, [file, files]);

  return <MarkdownPreview content={markdown} />;
};
