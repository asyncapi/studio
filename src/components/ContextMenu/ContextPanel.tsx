import React, { useState } from 'react';
import { VscChevronRight, VscChevronDown } from "react-icons/vsc";

interface ContextPanelProps {
  title: string;
  menu?: React.ReactNode
  opened?: boolean;
}

export const ContextPanel: React.FunctionComponent<ContextPanelProps> = ({
  title,
  menu,
  opened = false,
  children,
}) => {
  const [open, setOpen] = useState(opened);
  const [hover, setHover] = useState(false);

  return (
    <div 
      className="flex flex-col" 
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div 
        className="flex flex-row justify-between bg-gray-700 cursor-pointer text-xs leading-6 text-gray-300 pl-1 pr-2"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(oldState => !oldState);
        }}
      >
        <div>
          <button className="inline-block mr-1">
            {open ? (
              <VscChevronDown className="inline -mt-0.5" />
            ) : (
              <VscChevronRight className="inline -mt-0.5" />
            )}
          </button>
          <h3 className="uppercase inline-block font-bold">{title}</h3>
        </div>

        <div className={hover ? 'block' : 'hidden'}>
          {menu}
        </div>
      </div>
      <div className={open ? 'block' : 'hidden'}>
        {children}
      </div>
    </div>
  );
};
