import { useState, useEffect, FunctionComponent } from 'react';

import { FlowDiagram } from './FlowDiagram';

import { useDocumentsState, useSettingsState, useOtherState, otherState } from '@/state';

import type { OldAsyncAPIDocument as AsyncAPIDocument } from '@asyncapi/parser';
import { convertToOldAPI } from '@asyncapi/parser';

interface VisualiserProps {}

export const Visualiser: FunctionComponent<VisualiserProps> = () => {
  const [parsedSpec, setParsedSpec] = useState<AsyncAPIDocument | null>(null);
  const document = useDocumentsState(state => state.documents['asyncapi']?.document) || null;
  const autoRendering = useSettingsState(state => state.templates.autoRendering);
  const templateRerender = useOtherState(state => state.templateRerender);

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

  return (
    parsedSpec && (
      <div className="flex flex-1 flex-col h-full overflow-hidden">
        <div className="overflow-auto">
          <FlowDiagram parsedSpec={parsedSpec} />
        </div>
      </div>
    )
  );
};
