import React, { useEffect } from 'react';
import { AsyncAPIDocument } from '@asyncapi/parser';
import { AsyncApiComponentWP } from '@asyncapi/react-component';

import state from '../../state';
import { NavigationService } from '../../services';

interface HTMLWrapperProps {}

export const HTMLWrapper: React.FunctionComponent<HTMLWrapperProps> = () => {
  const parserState = state.useParserState();
  const editorState = state.useEditorState();

  // using "json()"" for removing proxy from value
  let parsedSpec = parserState.parsedSpec.value;
  parsedSpec = parsedSpec
    ? new (AsyncAPIDocument as any)(parsedSpec.json())
    : null;

  useEffect(() => {
    if (editorState.editorLoaded.get() === true) {
      setTimeout(NavigationService.scrollToHash, 0);
    }
  }, [editorState.editorLoaded.get()]); // eslint-disable-line react-hooks/exhaustive-deps

  if (editorState.editorLoaded.get() === false) {
    return (
      <div className="flex overflow-hidden h-full justify-center items-center text-2xl mx-auto px-6 text-center">
        Loading...
      </div>
    );
  }

  if (!parsedSpec) {
    return (
      <div className="flex overflow-hidden h-full justify-center items-center text-2xl mx-auto px-6 text-center">
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
