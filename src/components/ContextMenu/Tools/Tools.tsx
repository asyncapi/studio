import React from 'react';
import { useDrag } from 'react-dnd';

import { ContextPanel } from '../ContextPanel';

import { PanelsManager, DRAG_DROP_TYPES, ToolsManager, Tool, ToolCategory } from '../../../services';

import state from '../../../state';

interface ToolItemProps extends Tool {}

const ToolItem: React.FunctionComponent<ToolItemProps> = ({
  id,
  title,
  description,
  icon,
}) => {
  const panelsState = state.usePanelsState();
  const activePanel = panelsState.activePanel.get();

  const [_, drag] = useDrag({
    type: DRAG_DROP_TYPES.TOOL,
    item: { toolID: id },
  });

  return (
    <button 
      ref={drag}
      onClick={() => PanelsManager.addToolTab(id, activePanel)}
      className="p-2 rounded-lg border-2 border-gray-700 text-gray-300 bg-gray-700 transform transition duration-200 hover:scale-105 hover:border-pink-500 text-left w-full"
    >
      <div className="flex flex-row">
        <div className="mr-3 p-1">
          {icon()}
        </div>
        <div>
          <h3 className="text-sm font-bold leading-0">{title}</h3>
          <p className="text-xs text-gray-400 mt-1">{description}</p>
        </div>
      </div>
    </button>
  );
}

interface ToolsContextMenuProps {}

export const ToolsContextMenu: React.FunctionComponent<ToolsContextMenuProps> = () => {
  const tools = Object.values(ToolsManager.getTools());
  const developmentTools = tools.filter(tool => tool.category === ToolCategory.DEVELOPMENT);
  const previewTools = tools.filter(tool => tool.category === ToolCategory.PREVIEW);
  const othersTools = tools.filter(tool => tool.category === ToolCategory.OTHER);

  return (
    <div className="flex flex-col">
      <h2 className="p-2 text-gray-500 text-xs uppercase">
        {"Tools & Extensions"}
      </h2>
      {developmentTools.length > 0 && (
        <ContextPanel title="Development" opened={true}>
          <ul className="flex flex-col pb-8">
            {developmentTools.map(tool => (
              <li className="px-4 pt-4" key={tool.id}>
                <ToolItem {...tool} />
              </li>
            ))}
          </ul>
        </ContextPanel>
      )}
      {previewTools.length > 0 && (
        <ContextPanel title="Preview & Visualiser" opened={true}>
          <ul className="flex flex-col pb-8">
            {previewTools.map(tool => (
              <li className="px-4 pt-4" key={tool.id}>
                <ToolItem {...tool} />
              </li>
            ))}
          </ul>
        </ContextPanel>
      )}
      {othersTools.length > 0 && (
        <ContextPanel title="Other" opened={true}>
          <ul className="flex flex-col pb-8">
            {othersTools.map(tool => (
              <li className="px-4 pt-4" key={tool.id}>
                <ToolItem {...tool} />
              </li>
            ))}
          </ul>
        </ContextPanel>
      )}
    </div>
  );
};
