import React from 'react';
import { useDrag } from 'react-dnd';

import { PanelsManager, DRAG_DROP_TYPES, ToolsManager, Tool } from '../../../services';

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

  return (
    <div className="flex flex-col">
      <h2 className="p-2 text-gray-500 text-xs uppercase">
        Tools
      </h2>
      <ul className="flex flex-col pb-4">
        {tools.map(tool => (
          <li className="px-4 pt-4" key={tool.id}>
            <ToolItem {...tool} />
          </li>
        ))}
      </ul>
    </div>
  );
};
