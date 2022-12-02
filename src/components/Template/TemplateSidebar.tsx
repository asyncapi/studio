import React from 'react';
import { VscRefresh } from 'react-icons/vsc';

import { useSettingsState, otherState } from '../../state';

interface TemplateSidebarProps {}

export const TemplateSidebar: React.FunctionComponent<TemplateSidebarProps> = () => {
  const autoRendering = useSettingsState(state => state.templates.autoRendering);

  return (
    <div
      className="flex flex-row items justify-between bg-gray-800 border-b border-gray-700 text-sm"
      style={{ height: '30px', lineHeight: '30px' }}
    >
      {autoRendering ? (
        <div />
      ) : (
        <div className="ml-2 text-gray-500 text-xs flex" style={{ height: '30px', lineHeight: '30px' }}>
          <button type="button" className="text-xs" onClick={() => otherState.setState({ templateRerender: true })}>
            <div className="inline-block">
              <VscRefresh className="w-4 h-4 mt-1" />
            </div>
          </button>
          <span className="ml-2 italic">
            Rerender
          </span>
        </div>
      )}
    </div>
  );
};
