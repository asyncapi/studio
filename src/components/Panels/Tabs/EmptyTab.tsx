import React, { useCallback, useContext } from 'react';

import { PanelContext } from '../PanelContext';
import { TabContext } from './TabContext';

import { PanelsManager, ToolsManager, ToolID } from '../../../services';

export const EmptyTab: React.FunctionComponent = () => {
  const { currentPanel } = useContext(PanelContext);
  const { currentTab } = useContext(TabContext);

  const replaceTab = useCallback((toolID: ToolID) => {
    const newTab = PanelsManager.createToolTab(toolID);
    if (!newTab) {
      return;
    }
    PanelsManager.replaceTab(currentTab, newTab, currentPanel);
  }, []);

  const tools = Object.values(ToolsManager.getTools());
  return (
    <div className="bg-gray-800 h-full w-full flex flex-wrap justify-center content-center overflow-auto">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-center content-center">
          <div>
            <span className="uppercase text-gray-100 text-md font-bold">Available Tools</span>
            <div className="grid grid-cols-3 gap-4 py-4">
              {tools.map(({ id }) => (
                <button
                  onClick={() => replaceTab(id)}
                  key={id}
                  className="text-left flex flex-col cursor-pointer rounded-lg p-4 pb-6 transform transition duration-200 border-2 border-gray-400 hover:scale-105 hover:border-pink-500 bg-gray-100"
                >
                  <span className="block text-md text-gray-800 font-bold leading-0 ">{id}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
