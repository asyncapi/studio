import { useState } from 'react';
import { VscClose } from 'react-icons/vsc';

import { IconButton } from '../common';

import { useServices } from '../../services';
import { useFilesState, usePanelsState } from '../../state';

import type { FunctionComponent } from 'react';
import type { PanelTab } from '../../state/panels.state';

interface EditorTabProps {
  tab: PanelTab;
}

export const EditorTab: FunctionComponent<EditorTabProps> = ({
  tab,
}) => {
  const { panelsSvc } = useServices();
  const [hover, setHover] = useState<boolean>(false);
  const file = useFilesState(state => state.files[tab.uri]);
  const active = usePanelsState(state => state.panels['primary']?.activeTab) || '';

  if (!file) {
    return null
  }
  const { name, language } = file;

  return (
    <div 
      className='flex flex-col'
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div 
        className='flex flex-row items-center justify-between bg-gray-800 border-r border-r-gray-700 cursor-pointer text-xs leading-6 text-gray-300 pl-3 pr-1 py-1'
        style={active === tab.id ? { boxShadow: 'inset 0px 12px 0px -10px rgb(236 72 153)' } : {}}
        onClick={(e) => {
          e.stopPropagation();
          panelsSvc.setActiveTab(tab.panel, tab.id);
        }}
      >
        <span className="inline-block overflow-hidden whitespace-nowrap text-ellipsis mr-1">
          {name}.{language}
        </span>

        <IconButton
          icon={<VscClose className={`w-3.5 h-3.5 transition-opacity ${hover ? 'opacity-1' : 'opacity-0'}`} />}
          tooltip={{
            content: 'Close tab',
            delay: [500, 0],
          }} 
          onClick={e => {
            e.stopPropagation();
            panelsSvc.removeTab(tab.panel, tab.id);
          }}
        />
      </div>
    </div>
  );
};
