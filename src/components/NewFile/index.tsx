import React from 'react';
import { examples } from '../../examples';

import { EditorService } from '../../services';
import state from '../../state';

const NewFile = () => {
  const handleTemplateClick = (template: string) => {
    EditorService.updateState({ content: template, updateModel: true });

    const panels = state.sidebar.panels;
    panels.merge({
      newFile: false,
    });
  };

  const realLifeExamples = examples.filter((template) => template.type === 'real-example');
  const templates = examples.filter((template) => template.type === 'protocol');

  return (
    <div className="bg-gray-800 w-full  overflow-auto">
      <div className="max-w-5xl mx-auto py-10">
        <div className="flex">
          <div className="w-1/4 pr-10 space-y-4">
            <span className="uppercase text-white text-md font-bold">Quick Start</span>
            <span className="block text-gray-300 text-md leading-5">To get started please select a template.</span>
          </div>
          <div className="px-4 w-full  overflow-auto space-y-8 ">
            <div>
              <span className="uppercase text-gray-100 text-md font-bold">Templates</span>
              <div className="grid grid-cols-3 gap-4 py-4">
                {templates.map(({ title, description: Description, template }) => {
                  return (
                    <button
                      onClick={() => handleTemplateClick(template)}
                      key={title}
                      className="text-left flex flex-col cursor-pointer rounded-lg p-4 pb-6 transform transition duration-200 border-2 border-gray-400 hover:scale-105 hover:border-pink-500 bg-gray-100"
                    >
                      <span className="block text-md text-gray-800 font-bold leading-0 ">{title}</span>
                      <span className="block text-sm text-gray-500 font-light mt-1">
                        <Description />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <span className="uppercase text-gray-100 text-md font-bold">Real world Examples</span>
              <div className="grid grid-cols-3 gap-4 py-4">
                {realLifeExamples.map(({ title, description, template }) => {
                  return (
                    <button
                      onClick={() => handleTemplateClick(template)}
                      key={title}
                      className="text-left  flex flex-col cursor-pointer rounded-lg p-4 pb-6 transform transition duration-200 border-2 border-gray-400 hover:scale-105 hover:border-pink-500 bg-gray-100"
                    >
                      <span className="block text-md text-gray-800 font-bold">{title}</span>
                      <span className="block text-sm text-gray-500 font-light mt-1">
                        {description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <span className=" text-xs block text-white ">
              Don&apos;t see what you&apos;re looking for? <a target="_blank" href="https://github.com/asyncapi/studio/issues/new?assignees=&labels=enhancement&template=enhancement.md&title=Template%20Request:%20{%20template%20name%20and%20type%20}" className="underline text-pink-500" rel="noreferrer">Request a template or add one to the list &rarr;</a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewFile;
