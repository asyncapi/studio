import React from 'react';
import { useDrag } from 'react-dnd';

import { ContextPanel } from '../ContextPanel';

import { PanelsManager, DRAG_DROP_TYPES } from '../../../services';

import { examples } from '../../../examples';

export interface Template {
  type: 'protocol' | 'real-example',
  title: string;
  description: string;
  template: string,
}

interface TemplateItemProps extends Template {}

const TemplateItem: React.FunctionComponent<TemplateItemProps> = ({
  title,
  description,
  template,
}) => {
  const [_, drag] = useDrag({
    type: DRAG_DROP_TYPES.FILE,
    item: {},
  });

  return (
    <button
      ref={drag}
      className="p-2 rounded-lg border-2 border-gray-700 text-gray-300 bg-gray-700 transform transition duration-200 hover:scale-105 hover:border-pink-500 text-left w-full"
      // onClick={() => handleTemplateClick(template)}
      key={title}
    >
      <div>
        <h3 className="text-sm font-bold leading-0 ">{title}</h3>
        <p className="block text-xs text-gray-400 font-light mt-1">
          {description}
        </p>
      </div>
    </button>
  );
}

interface TemplatesContextMenuProps {}

export const TemplatesContextMenu: React.FunctionComponent<TemplatesContextMenuProps> = () => {
  const protocolTemplates = examples.filter((template) => template.type === 'protocol');
  const realLifeTemplates = examples.filter((template) => template.type === 'real-example');

  return (
    <div className="flex flex-col">
      <h2 className="p-2 text-gray-500 text-xs uppercase">
        {"Templates & Examples"}
      </h2>
      <ContextPanel title="Protocol templates" opened={true}>
        <ul className="flex flex-col pb-4">
          {protocolTemplates.map(template => (
            <li className="px-4 pt-4" key={template.title}>
              <TemplateItem key={template.title} {...template} />
            </li>
          ))}
        </ul>
      </ContextPanel>
      <ContextPanel title="Real world examples">
        <ul className="flex flex-col pb-4">
          {realLifeTemplates.map(template => (
            <li className="px-4 pt-4" key={template.title}>
              <TemplateItem key={template.title} {...template} />
            </li>
          ))}
        </ul>
      </ContextPanel>
    </div>
  );
};
