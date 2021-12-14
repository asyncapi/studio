import React, { useEffect, useState } from 'react';

interface SwitchProps {
  toggle?: boolean;
  onChange: (toggle: boolean) => void;
}

export const Switch: React.FunctionComponent<SwitchProps> = ({ 
  toggle: initToggle = false, 
  onChange,
}) => {
  const [toggle, setToggle] = useState(initToggle);
  const toggleClass = ' transform translate-x-5 bg-pink-500';

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
          {/* <div className={`absolute w-6 h-6 bg-white rounded-full bg-gray-200 transition ${toggle ? toggleClass : null}`} /> */}
        </div>
      </label>
    </div>
  );
};