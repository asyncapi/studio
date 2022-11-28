import React, { useState, useEffect } from 'react';
import { AsyncApiComponentWP } from '@asyncapi/react-component';

import { useServices } from '../../services';
import state from '../../state';

import type { OldAsyncAPIDocument as AsyncAPIDocument } from '@asyncapi/parser/cjs';

interface HTMLWrapperProps {}

export const HTMLWrapper: React.FunctionComponent<HTMLWrapperProps> = () => {
  const [parsedSpec, setParsedSpec] = useState<AsyncAPIDocument | null>(null);

  const { navigationSvc, specificationSvc } = useServices();
  const appState = state.useAppState();
  const parserState = state.useParserState();
  const editorState = state.useEditorState();
  const templateState = state.useTemplateState();
  const settingsState = state.useSettingsState();

  const documentValid = parserState.valid.get();
  const editorLoaded = editorState.editorLoaded.get();
  const autoRendering = settingsState.templates.autoRendering.get();

  useEffect(() => {
    if (editorLoaded === true) {
      setTimeout(navigationSvc.scrollToHash, 0);
    }
  }, [editorLoaded]); // eslint-disable-line

  useEffect(() => {
    if (autoRendering || parsedSpec === null) {
      setParsedSpec(specificationSvc.getParsedSpec());
    }
  }, [parserState.parsedSpec.get()]); // eslint-disable-line

  useEffect(() => {
    if (templateState.rerender.get()) {
      setParsedSpec(specificationSvc.getParsedSpec());
      templateState.rerender.set(false);
    }
  }, [templateState.rerender.get()]); // eslint-disable-line

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
          <AsyncApiComponentWP
            schema={parsedSpec}
            config={{ 
              show: { 
                errors: false,
                sidebar: appState.readOnly.get(),
              },
            }}
          />
        </div>
      </div>
    )
  );
};
