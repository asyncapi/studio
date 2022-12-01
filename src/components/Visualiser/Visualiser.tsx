import { useState, useEffect } from 'react';

import { FlowDiagram } from './FlowDiagram';

import { useServices } from '../../services';
import state from '../../state';
import { useDocumentsState, useSettingsState } from '../../state/index.state';

import type { OldAsyncAPIDocument as AsyncAPIDocument } from '@asyncapi/parser/cjs';
import type { FunctionComponent } from 'react';

interface VisualiserProps {}

export const Visualiser: FunctionComponent<VisualiserProps> = () => {
  const [parsedSpec, setParsedSpec] = useState<AsyncAPIDocument | null>(null);
  const document = useDocumentsState(state => state.documents['asyncapi']?.document) || null;
  const autoRendering = useSettingsState(state => state.templates.autoRendering);
  const templateState = state.useTemplateState();

  useEffect(() => {
    if (autoRendering || parsedSpec === null) {
      setParsedSpec(document);
    }
  }, [document]); // eslint-disable-line

  useEffect(() => {
    if (templateState.rerender.get()) {
      setParsedSpec(document);
      templateState.rerender.set(false);
    }
  }, [templateState.rerender.get()]); // eslint-disable-line

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
