import React, { useState } from 'react';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import toast from 'react-hot-toast';

import { ConfirmModal } from './index';
import examples from '../../examples';
import { useServices } from '../../services';
import state from '../../state';

interface TemplateListItemProps {
  title: string;
  description: React.ComponentType;
  isSelected: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  key: string;
}

const TemplateListItem: React.FunctionComponent<TemplateListItemProps> = ({ title, description: Description, onClick, isSelected }) => {
  const containerStyles = isSelected ? 'border-pink-500' : 'border-gray-200';
  const textStyles = isSelected ? 'text-pink-600' : 'text-gray-600';

  return (
    <button onClick={onClick} key={title} className={`group text-left flex flex-col cursor-pointer rounded-lg p-4 pb-6 border-2 hover:border-pink-500 ${containerStyles}`}>
      <div className="flex justify-between w-full">
        <span className={`block text-md font-bold leading-0 group-hover:text-pink-600 ${textStyles}`}>{title}</span>
        {isSelected && <BsFillCheckCircleFill className="w-5 h-5 text-pink-600" />}
      </div>
      <span className="block text-sm text-gray-500 font-light mt-1 group-hover:text-gray-900">
        <Description />
      </span>
    </button>
  );
};

export const NewFileModal: React.FunctionComponent = () => {
  const { editorSvc } = useServices();
  const sidebarState = state.useSidebarState();
  const newFileEnabled = sidebarState.panels.newFile.get();
  const [selectedTemplate, setSelectedTemplate] = useState({ title: '', template: '' });

  const onSubmit = () => {
    editorSvc.updateState({ content: selectedTemplate.template, updateModel: true });
    sidebarState.panels.newFile.set(false);
    setSelectedTemplate({ title: '', template: '' });

    toast.success(
      <div>
        <span className="block text-bold">Succesfully reused the {`"${selectedTemplate.title}"`} template.</span>
      </div>
    );
  };

  const onCancel = () => {
    sidebarState.panels.newFile.set(false);
    setSelectedTemplate({ title: '', template: '' });
  };

  const realLifeExamples = examples.filter((template) => template.type === 'real-example');
  const templates = examples.filter((template) => template.type === 'protocol-example');

  return (
    <ConfirmModal
      containerClassName="sm:max-w-6xl"
      title="AsyncAPI Templates - Start with our template examples"
      confirmText="Use Template"
      confirmDisabled={!selectedTemplate.template}
      show={newFileEnabled}
      onSubmit={onSubmit}
      onCancel={onCancel}
    >
      <div className="flex content-center justify-center">
        <div className="w-full  overflow-auto space-y-8 ">
          <div>
            <span className="uppercase text-gray-800 text-sm underline font-bold">Templates</span>
            <div className="grid grid-cols-3 gap-4 py-4">
              {templates.map(({ title, description, template }) => {
                const isSelected = selectedTemplate.title === title;
                return <TemplateListItem title={title} description={description} isSelected={isSelected} key={title} onClick={() => setSelectedTemplate({ title, template })} />;
              })}
            </div>
          </div>
          <div>
            <span className="uppercase text-gray-800 text-sm underline font-bold">Real world Examples</span>
            <div className="grid grid-cols-3 gap-4 py-4">
              {realLifeExamples.map(({ title, description, template }) => {
                const isSelected = selectedTemplate.title === title;
                return <TemplateListItem title={title} description={description} isSelected={isSelected} key={title} onClick={() => setSelectedTemplate({ title, template })} />;
              })}
            </div>
          </div>
          <span className=" text-xs block text-gray-900 text-right ">
            Don&apos;t see what you&apos;re looking for? <br />
            <a
              target="_blank"
              href="https://github.com/asyncapi/studio/issues/new?assignees=&labels=enhancement&template=enhancement.md&title=Template%20Request:%20{%20template%20name%20and%20type%20}"
              className="underline text-pink-500"
              rel="noreferrer"
            >
              Request a template or add one to the list &rarr;
            </a>
          </span>
        </div>
      </div>
    </ConfirmModal>
  );
};
