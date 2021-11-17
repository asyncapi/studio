import React from 'react';
import { AsyncAPIDocument } from '@asyncapi/parser';
import state from '../../state';

import { FlowDiagram } from './FlowDiagram';

interface VisualiserProps {}

export const Visualiser: React.FunctionComponent<VisualiserProps> = () => {
  const parserState = state.useParserState();
  const editorState = state.useEditorState();

  const documentValid = parserState.valid.get();
  const editorLoaded = editorState.editorLoaded.get();

  // using "json()" for removing proxy from value
  let parsedSpec = parserState.parsedSpec.value;
  parsedSpec = parsedSpec ? new (AsyncAPIDocument as any)(parsedSpec.json()) : null;

  if (editorLoaded === false) {
    return (
      <div className="flex flex-1 overflow-hidden h-full justify-center items-center text-2xl mx-auto px-6 text-center">
        <div>
          <div className="w-full text-center h-8">
            <div className="rotating-wheel"></div>
          </div>
          <p className="mt-1 text-sm">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!documentValid) {
    return (
      <div className="flex flex-1 overflow-hidden h-full justify-center items-center text-2xl mx-auto px-6 text-center">
        <p>Empty or invalid document. Please fix errors/define AsyncAPI document.</p>
      </div>
    );
  }

  return (
    parsedSpec && (
      <div className="flex flex-1 flex-col h-full overflow-hidden">
        <div className="overflow-auto">
          <FlowDiagram  parsedSpec={parsedSpec} />
        </div>
      </div>
    )
  );
};
