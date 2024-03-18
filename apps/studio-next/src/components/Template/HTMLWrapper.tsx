'use client';

import React, { useState, useEffect } from 'react';

import { useDocumentsState } from '../../state';
import { AsyncAPIDocumentInterface } from '@asyncapi/parser/cjs';
import { AsyncApiComponentWP } from '@asyncapi/react-component';
import '@asyncapi/react-component/styles/default.min.css';

interface HTMLWrapperProps {}

export const HTMLWrapper: React.FunctionComponent<HTMLWrapperProps> = () => {
  const [parsedSpec, setParsedSpec] = useState<AsyncAPIDocumentInterface | null>(null);
  const document = useDocumentsState(state => state.documents['asyncapi']?.document) || null;
  const [loading, setloading] = useState(false);

  useEffect(() => {
    if (parsedSpec === null) {
      setParsedSpec(document);
    }
  }, [document]); // eslint-disable-line

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
        <div className="overflow-auto">
          <AsyncApiComponentWP
            schema={parsedSpec}
            config={{ 
              show: { 
                errors: false,
                // sidebar: appState.getState().readOnly,
              },
            }}
          />
        </div>
      </div>
    )
  );
};
