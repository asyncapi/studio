import React, { useState, useEffect, useMemo } from 'react';
import { AsyncApiComponentWP } from '@asyncapi/react-component';

import { useServices } from '../../services';
import { appState, useDocumentsState, useSettingsState, useOtherState, otherState, useFilesState } from '../../state';

import { AsyncAPIDocumentInterface } from '@asyncapi/parser';

interface HTMLWrapperProps {}

export const HTMLWrapper: React.FunctionComponent<HTMLWrapperProps> = () => {
  const [parsedSpec, setParsedSpec] = useState<AsyncAPIDocumentInterface | null>(null);
  const { navigationSvc, formatSvc } = useServices();
  const document = useDocumentsState(state => state.documents['asyncapi']?.document) || null;
  const activeFile = useFilesState(state => state.files['asyncapi']);
  const [loading, setloading] = useState(false);

  const autoRendering = useSettingsState(state => state.templates.autoRendering);
  const templateRerender = useOtherState(state => state.templateRerender);
  const emptyStateMessage = useMemo(() => {
    const specType = formatSvc.detectSpecType(activeFile?.content || '');
    if (specType === 'openapi') {
      return 'OpenAPI document detected. AsyncAPI preview is not available for this file.';
    }
    return 'Empty or invalid document. Please fix errors/define AsyncAPI document.';
  }, [activeFile?.content, formatSvc]);

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
          <p>{emptyStateMessage}</p>
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
