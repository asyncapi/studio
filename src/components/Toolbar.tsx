import React from 'react';

import state from '../state';

interface ToolbarProps {}

export const Toolbar: React.FunctionComponent<ToolbarProps> = () => {
  const sidebarState = state.useSidebarState();

  if (sidebarState.show.get() === false) {
    return null;
  }

  return (
    <div>
      <div className="px-4 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                className="inline-block h-20"
                src="/img/logo-horizontal-white.svg"
                alt=""
              />
              <span className="inline-block text-xl text-pink-500 font-normal italic tracking-wide -ml-1 transform translate-y-0.5">
                studio
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
