import { ApplicationView } from '@lagoni/edavisualiser';
import React, { useState, useEffect } from 'react';
import { AsyncAPIDocument } from '@asyncapi/parser';
import { SpecificationService } from '../../services';
import state from '../../state';
import { TemplateSidebar } from '../Template/TemplateSidebar';

interface VisualiserTemplateProps {}

export const VisualiserTemplate: React.FunctionComponent<VisualiserTemplateProps> = () => {
  const [parsedSpec, setParsedSpec] = useState<AsyncAPIDocument | null>(null);


  const parserState = state.useParserState();
  const editorState = state.useEditorState();
  const templateState = state.useTemplateState();
  const settingsState = state.useSettingsState();

  const documentValid = parserState.valid.get();
  const editorLoaded = editorState.editorLoaded.get();
  const autoRendering = settingsState.templates.autoRendering.get();

  useEffect(() => {
    if (autoRendering || parsedSpec === null) {
      setParsedSpec(SpecificationService.getParsedSpec());
    }
  }, [parserState.parsedSpec]); // eslint-disable-line

  useEffect(() => {
    if (templateState.rerender.get()) {
      setParsedSpec(SpecificationService.getParsedSpec());
      templateState.rerender.set(false);
    }
  }, [templateState.rerender.get()]); // eslint-disable-line
  let content;
  if (editorLoaded === false) {
    content = (
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
    content = (
      <div className="flex flex-1 overflow-hidden h-full justify-center items-center text-2xl mx-auto px-6 text-center">
        <p>Empty or invalid document. Please fix errors/define AsyncAPI document.</p>
      </div>
    );
  }

  if (content === undefined) {
    const title = parsedSpec?.info().title() || '';
    const sideMenu = () => {
      return (
        <div className="m-4 px-2 text-lg absolute text-gray-800 top-0 left-0 bg-white space-x-2 py-2 border border-gray-100 inline-block">
          <span className="font-bold">Event Visualiser</span>
          <span className="text-gray-200">|</span>
          <span className="font-light capitalize">{title}</span>
        </div>
      );
    }
    content = (
      parsedSpec && (
        <div className="overflow-auto h-screen bg-gray-800 relative">
          <ApplicationView asyncapi={{document: parsedSpec}} sideMenu={sideMenu as any} />
        </div>
      )
    );
  }
  return (
    <div className="flex flex-1 flex-col h-full overflow-hidden">
      <TemplateSidebar />
      {content}
    </div>
  );
};