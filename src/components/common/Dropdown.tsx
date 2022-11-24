import { useState, useRef } from 'react';

import { useOutsideClickCallback } from '../../helpers';

import type { FunctionComponent, PropsWithChildren, ReactNode } from 'react';

interface DropdownProps extends PropsWithChildren {
  opener: ReactNode;
  className?: string;
  buttonHoverClassName?: string;
  align?: string;
}

export const Dropdown: FunctionComponent<DropdownProps> = ({
  opener,
  className = 'relative',
  buttonHoverClassName,
  align = 'right',
  children,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useOutsideClickCallback(dropdownRef, () => setOpen(false));
  buttonHoverClassName = buttonHoverClassName || 'hover:text-white';

  return (
    <div className={className}>
      <button
        onClick={() => setOpen(!open)}
        type="button"
        className={`flex p-2 text-sm rounded-md ${buttonHoverClassName} focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition ease-in-out duration-150`}
      >
        {opener}
      </button>
      <div
        ref={dropdownRef}
        onClick={() => setOpen(false)}
        className={`${
          open ? 'visible' : 'invisible'
        } origin-top-right absolute ${align === 'right' &&
          'right-0'} ${align === 'left' &&
          'left-0'} mt-1 mr-3 w-64 rounded-md shadow-lg z-50`}
      >
        <div className="rounded-md bg-gray-800 shadow-xs">
          <div className="py-1">{children}</div>
        </div>
      </div>
    </div>
  );
};
