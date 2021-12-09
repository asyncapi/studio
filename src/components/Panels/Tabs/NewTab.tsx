import React, { useContext } from 'react';

import { MonacoWrapper } from '../../Editor';
import { HTMLWrapper } from '../../Template';
import { Terminal } from '../../Terminal';
import { Visualiser } from '../../Visualiser';

import { PanelContext } from '../PanelContext';
import { TabContext } from './TabContext';

import { PanelsManager } from '../../../services';
import { generateUniqueID } from '../../../helpers';

const tools = [
  {
    title: 'Editor',
    description: () => <>A Editor</>,
    tool: 'editor',
    tab: () => (
      <span>Editor</span>
    ),
    content: () => <MonacoWrapper />
  },
  {
    title: 'HTML Template',
    description: () => <>A HTML template</>,
    tool: 'html',
    tab: () => (
      <span>HTML</span>
    ),
    content: () => <HTMLWrapper />
  },
  {
    title: 'Visualiser',
    description: () => <>A Visualiser</>,
    tool: 'visualiser',
    tab: () => (
      <span>Visualiser</span>
    ),
    content: () => <Visualiser />
  },
  {
    title: 'Terminal',
    description: () => <>A Terminal</>,
    tool: 'terminal',
    tab: () => (
      <span>Terminal</span>
    ),
    content: () => <Terminal />
  },
];

export const NewTab: React.FunctionComponent = () => {
  const { currentPanel } = useContext(PanelContext);
  const { currentTab } = useContext(TabContext);

  const handleToolClick = (toolName: string) => {
    const tool = tools.find(t => t.tool === toolName);
    if (tool) {
      const newTab = {
        name: generateUniqueID(),
        tab: tool.tab(),
        content: tool.content(),
        isNewTab: false,
      };
      PanelsManager.changeTab(currentPanel, currentTab, newTab);
    }
  };

  return (
    <div className="bg-gray-800 h-full w-full flex flex-wrap justify-center content-center overflow-auto">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-center content-center">
          <div>
            <span className="uppercase text-gray-100 text-md font-bold">Available Tools</span>
            <div className="grid grid-cols-3 gap-4 py-4">
              {tools.map(({ title, description: Description, tool }) => {
                return (
                  <button
                    onClick={() => handleToolClick(tool)}
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
        </div>
      </div>
    </div>
  );
};
