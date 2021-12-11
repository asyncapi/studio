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

  return (
    <div className="flex flex-col border-b border-gray-700">
      <div 
        className="text-sm border-b border-gray-700 leading-6 text-gray-300 cursor-pointer px-1"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(oldState => !oldState);
        }}
      >
        <button className="inline-block mr-1">
          {open ? (
            <VscChevronDown className="inline -mt-0.5" />
          ) : (
            <VscChevronRight className="inline -mt-0.5" />
          )}
        </button>
        {title}
      </div>
      <div className={`pb-6 ${open ? 'block' : 'hidden'}`}>
        {children}
      </div>
    </div>
  );
};
