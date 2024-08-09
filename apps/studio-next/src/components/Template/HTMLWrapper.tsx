import React, { useState, useEffect } from 'react';
import { AsyncApiComponentWP } from '@asyncapi/react-component';

import { useServices } from '../../services';
import { appState, useDocumentsState, useSettingsState, useOtherState, otherState } from '../../state';

import { AsyncAPIDocumentInterface } from '@asyncapi/parser';

interface HTMLWrapperProps {}

export const HTMLWrapper: React.FunctionComponent<HTMLWrapperProps> = () => {
  const [parsedSpec, setParsedSpec] = useState<AsyncAPIDocumentInterface | null>(null);
  const { navigationSvc } = useServices();
  const document = useDocumentsState(state => state.documents['asyncapi']?.document) || null;
  const [loading, setloading] = useState(false);

  const autoRendering = useSettingsState(state => state.templates.autoRendering);
  const templateRerender = useOtherState(state => state.templateRerender);

  useEffect(() => {
    navigationSvc.scrollToHash();
  }, []); // eslint-disable-line

  useEffect(() => {
    if (autoRendering || parsedSpec === null) {
      setParsedSpec(document);
    }
  }, [document]); // eslint-disable-line

  useEffect(() => {
    if (templateRerender) {
      setParsedSpec(document);
      otherState.setState({ templateRerender: false });
    }
  }, [templateRerender]); // eslint-disable-line

  useEffect(() => {
    if (!document) {
      setloading(true);
      const timer = setTimeout(() => {
        setloading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  },[document])
  if (!document) {
    return (
      <div className="flex flex-1 overflow-hidden h-full justify-center items-center text-2xl mx-auto px-6 text-center">
        {loading ?(
          <div className="rotating-wheel"></div>
        ) : (
          <p>Empty or invalid document. Please fix errors/define AsyncAPI document.</p>
        )
        }
      </div>
    );
  }

  return (
    parsedSpec && (
      <div className="flex flex-1 flex-col h-full overflow-hidden">
        <div className="overflow-auto" id="html-preview">
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
