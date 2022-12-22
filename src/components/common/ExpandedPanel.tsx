import { useState } from 'react';
import { VscChevronDown, VscChevronRight } from 'react-icons/vsc';

import type { FunctionComponent, ReactNode, PropsWithChildren } from 'react';

interface ExpandedPanelProps {
  title: ReactNode;
  expanded?: boolean;
  actions?: Array<ReactNode>;
}

export const ExpandedPanel: FunctionComponent<PropsWithChildren<ExpandedPanelProps>> = ({ 
  title,
  actions = [],
  expanded: initialExpanded = false,
  children,
}) => {
  const [expanded, setExpanded] = useState<boolean>(initialExpanded);
  const [hover, setHover] = useState<boolean>(false);

  return (
    <div 
      className='flex flex-col w-full h-full'
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div 
        className='flex flex-row items-center justify-between bg-gray-800 hover:bg-gray-700 cursor-pointer text-xs leading-6 text-gray-300 px-2 py-1'
        onClick={(e) => {
          e.stopPropagation();
          setExpanded(oldState => !oldState);
        }}
      >
        <button className="flex-none inline-block mr-1">
          {expanded ? (
            <VscChevronDown className='w-3.5 h-3.5' />
          ) : (
            <VscChevronRight className='w-3.5 h-3.5' />
          )}
        </button>

        <h3 className="flex-1 uppercase inline-block font-bold overflow-hidden whitespace-nowrap text-ellipsis">
          {title}
        </h3>

        {actions.length > 0 ? (
          <div className={`flex-none transition-opacity ${hover ? 'opacity-1' : 'opacity-0'}`}>
            <ul className='flex flex-row items-center'>
              {actions.map((action, idx) => (
                <li key={idx}>
                  {action}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      <div className={`relative h-full ${expanded ? 'block' : 'hidden'}`}>
        {children}
      </div>
    </div>
  );
};
