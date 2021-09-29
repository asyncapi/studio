import React from 'react';
import { AsyncAPIDocument } from '@asyncapi/parser';
import { AsyncApiComponentWP } from '@asyncapi/react-component';

import state from '../../state';

interface HTMLWrapperProps {}

export const HTMLWrapper: React.FunctionComponent<HTMLWrapperProps> = () => {
  const parserState = state.useParserState();
  const editorState = state.useEditorState();

  // using "json()"" for removing proxy from value
  let parsedSpec = parserState.parsedSpec.value;
  parsedSpec = parsedSpec
    ? new (AsyncAPIDocument as any)(parsedSpec.json())
    : null;

  if (editorState.editorLoaded.get() === false) {
    return (
      <div className="flex flex-1 overflow-hidden h-full justify-center items-center text-2xl mx-auto px-6 text-center">
        Loading...
      </div>
    );
  }

  if (!parsedSpec) {
    return (
      <div className="flex flex-1 overflow-hidden h-full justify-center items-center text-2xl mx-auto px-6 text-center">
        Empty or invalid document. Please fix errors/define AsyncAPI document.
      </div>
    );
  }

  return (
    parsedSpec && (
      <div className="flex flex-1 flex-col h-full overflow-hidden">
        <div className="overflow-auto">
          <AsyncApiComponentWP
            schema={parsedSpec}
            config={{ show: { errors: false } }}
          />
        </div>
      </div>
    )
  );
};
