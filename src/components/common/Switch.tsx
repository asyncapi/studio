import React, { useState } from 'react';

interface SwitchProps {
  toggle?: boolean;
  onChange: (toggle: boolean) => void;
}

export const Switch: React.FunctionComponent<SwitchProps> = ({ 
  toggle: initToggle = false, 
  onChange,
}) => {
  const [toggle, setToggle] = useState(initToggle);

  return (
    <div 
      onClick={() => {
        const newValue = !toggle;
        setToggle(newValue);
        onChange(newValue);
      }}
    >
      <label 
        htmlFor="toggle"
        className="flex items-center cursor-pointer"
      >
        <div className="relative">
          <input type="checkbox" className="sr-only" />
          <div className={`w-12 h-6 rounded-full shadow-inner p-1 ${toggle ? 'bg-pink-500' : 'bg-gray-300'}`}>
            <div className={`w-6 h-4 rounded-full bg-white transition ${toggle ? 'transform translate-x-4' : ''}`}></div>
          </div>
        </div>
      </label>
    </div>
  );
};