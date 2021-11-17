import React, { useEffect } from 'react';
import { AsyncAPIDocument } from '@asyncapi/parser';
import { AsyncApiComponentWP } from '@asyncapi/react-component';

import { NavigationService } from '../../services';
import state from '../../state';

interface HTMLWrapperProps {}

export const HTMLWrapper: React.FunctionComponent<HTMLWrapperProps> = () => {
  const parserState = state.useParserState();
  const editorState = state.useEditorState();

  const documentValid = parserState.valid.get();
  const editorLoaded = editorState.editorLoaded.get();

  // using "json()" for removing proxy from value
  let parsedSpec = parserState.parsedSpec.value;
  parsedSpec = parsedSpec
    ? new (AsyncAPIDocument as any)(parsedSpec.json())
    : null;

  useEffect(() => {
    if (editorLoaded === true) {
      setTimeout(NavigationService.scrollToHash, 0);
    }
  }, [editorLoaded]); // eslint-disable-line

  if (editorLoaded === false) {
    return (
      <div className="flex flex-1 overflow-hidden h-full justify-center items-center text-2xl mx-auto px-6 text-center">
        <div>
          <div className="cssload-container">
            <div className="cssload-speeding-wheel"></div>
          </div>
          <p className="mt-1">
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
          <AsyncApiComponentWP
            schema={parsedSpec}
            config={{ 
              show: { 
                errors: false,
              },
            }}
          />
        </div>
      </div>
    )
  );
};
