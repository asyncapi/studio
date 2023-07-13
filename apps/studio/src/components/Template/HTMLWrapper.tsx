'use client'

import React, { useState, useEffect } from 'react';
import { AsyncApiComponentWP } from '@asyncapi/react-component';

import { appState, useDocumentsState, useSettingsState, useOtherState, otherState } from '../../states';

import type { OldAsyncAPIDocument } from '@asyncapi/parser/cjs';
import { useServices } from '../../hooks';

interface HTMLWrapperProps {}

export const HTMLWrapper: React.FunctionComponent<HTMLWrapperProps> = () => {
  const [parsedSpec, setParsedSpec] = useState<OldAsyncAPIDocument | null>(null);
  const { navigationSvc } = useServices();
  // Currently using the old Document API which is creating redundancy
  // TODO : After @asyncAPI/react is migrated to the new API change it again.
  const document = useDocumentsState(state => state.documents['asyncapi']?.oldDocument) || null;
  const autoRendering = useSettingsState(state => state.templates.autoRendering);
  const templateRerender = useOtherState(state => state.templateRerender);

  useEffect(() => {
    navigationSvc.scrollToHash();
  }, []); // eslint-disable-line

  useEffect(() => {
    if (autoRendering || parsedSpec === null) {
      setParsedSpec(document);
    }
  }, [document]);

  useEffect(() => {
    if (templateRerender) {
      setParsedSpec(document);
      otherState.setState({ templateRerender: false });
    }
  }, [templateRerender]);

  if (!document) {
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
                sidebar: appState.getState().readOnly,
              },
            }}
          />
        </div>
      </div>
    )
  );
};
