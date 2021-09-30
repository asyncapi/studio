import React from 'react';

import { Editor } from './Editor/Editor';
import { Template } from './Template';

interface ContentProps {}

export const Content: React.FunctionComponent<ContentProps> = () => {
  return (
    <div className="flex flex-1 flex-row relative">
      <Editor />
      <Template />
    </div>
  );
};
