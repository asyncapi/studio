import React, { useEffect, useState } from 'react';

interface SwitchProps {
  toggle?: boolean;
  callback: (toggle: boolean) => void;
}

export const Switch: React.FunctionComponent<SwitchProps> = ({ 
  toggle: initToggle = false, 
  callback,
}) => {
  const [toggle, setToggle] = useState(initToggle);
  const toggleClass = ' transform translate-x-5 bg-pink-500';

  useEffect(() => {
    callback(toggle);
  }, [toggle, callback]);

  return (
    <div 
      onClick={() => {
        setToggle(!toggle);
      }}
    >
      <label 
        htmlFor="toggle"
        className="flex items-center cursor-pointer"
      >
        <div className="relative">
          <input type="checkbox" className="sr-only" />
          <div className="w-10 h-4 mt-1 bg-gray-400 rounded-full shadow-inner" />
          <div className={`absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 mt-1 bg-gray-200 transition ${toggle ? toggleClass : null}`} />
        </div>
      </label>
    </div>
  );
};