import React, { useState, useEffect } from 'react';
import { AsyncApiComponentWP } from '@asyncapi/react-component';

import { useServices } from '../../services';
import { appState, useDocumentsState, useSettingsState, useOtherState, otherState } from '../../state';

import { OldAsyncAPIDocument as AsyncAPIDocument, convertToOldAPI } from '@asyncapi/parser/cjs';

interface HTMLWrapperProps {}

export const HTMLWrapper: React.FunctionComponent<HTMLWrapperProps> = () => {
  const [parsedSpec, setParsedSpec] = useState<AsyncAPIDocument | null>(null);
  const { navigationSvc } = useServices();
  const document = useDocumentsState(state => state.documents['asyncapi']?.document) || null;

  const autoRendering = useSettingsState(state => state.templates.autoRendering);
  const templateRerender = useOtherState(state => state.templateRerender);

  useEffect(() => {
    navigationSvc.scrollToHash();
  }, []); // eslint-disable-line

  useEffect(() => {
    if (autoRendering || parsedSpec === null) {
      const oldDocument = document !== null ? convertToOldAPI(document) : null;
      setParsedSpec(oldDocument);
    }
  }, [document]); // eslint-disable-line

  useEffect(() => {
    if (templateRerender) {
      const oldDocument = document !== null ? convertToOldAPI(document) : null;
      setParsedSpec(oldDocument);
      otherState.setState({ templateRerender: false });
    }
  }, [templateRerender]); // eslint-disable-line

  if (!document) {
    return (
      <div className="flex flex-1 overflow-hidden h-full justify-center items-center text-2xl mx-auto px-6 text-center">
        <p>Empty or invalid document. Please fix errors/define AsyncAPI document.</p>
      </div>
    );
  }

  if (document?.version() === '3.0.0') {
    return (
      <div className="flex flex-1 overflow-hidden h-full justify-center items-center text-2xl mx-auto px-6 text-center">
        <p>Documentation preview is not supported yet for v3.0.0 specifications.</p>
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
                sidebar: appState.getState().readOnly,
              },
            }}
          />
        </div>
      </div>
    )
  );
};
