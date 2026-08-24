import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useOutsideClickCallback } from '@/helpers';

import type { CSSProperties, FunctionComponent, KeyboardEvent as ReactKeyboardEvent, PropsWithChildren, ReactNode } from 'react';

const MENU_WIDTH_PX = 256;
const MENU_GAP_PX = 4;
const VIEWPORT_PADDING_PX = 8;

interface DropdownProps extends PropsWithChildren {
  opener: ReactNode;
  className?: string;
  buttonHoverClassName?: string;
  align?: 'left' | 'right';
  dataTest?: string;
}

function getMenuPosition(trigger: DOMRect, align: 'left' | 'right', menuHeight: number) {
  const preferredLeft = align === 'left' ? trigger.left : trigger.right - MENU_WIDTH_PX;
  const maxLeft = window.innerWidth - MENU_WIDTH_PX - VIEWPORT_PADDING_PX;
  const left = Math.min(Math.max(preferredLeft, VIEWPORT_PADDING_PX), maxLeft);

  const topBelow = trigger.bottom + MENU_GAP_PX;
  const topAbove = trigger.top - menuHeight - MENU_GAP_PX;
  const fitsBelow = topBelow + menuHeight <= window.innerHeight - VIEWPORT_PADDING_PX;

  if (fitsBelow || topAbove < VIEWPORT_PADDING_PX) {
    return { top: topBelow, left };
  }

  return { top: topAbove, left };
}

export const Dropdown: FunctionComponent<DropdownProps> = ({
  opener,
  className = 'relative',
  buttonHoverClassName = 'hover:text-white',
  align = 'right',
  dataTest = 'button-dropdown',
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<CSSProperties | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuId = useId();

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((isOpen) => !isOpen), []);

  useOutsideClickCallback([buttonRef, menuRef], close, open);

  const updatePosition = useCallback(() => {
    const trigger = buttonRef.current;
    const menu = menuRef.current;
    if (!trigger) {
      return;
    }

    const nextPosition = getMenuPosition(
      trigger.getBoundingClientRect(),
      align,
      menu?.offsetHeight ?? 0,
    );
    setPosition({ top: nextPosition.top, left: nextPosition.left });
  }, [align]);

  useLayoutEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }

    updatePosition();
    menuRef.current?.focus();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleReposition = () => updatePosition();
    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
        buttonRef.current?.focus();
      }
    };

    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);
    document.addEventListener('keydown', handleDocumentKeyDown);

    return () => {
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
      document.removeEventListener('keydown', handleDocumentKeyDown);
    };
  }, [open, close, updatePosition]);

  const handleButtonKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' && !open) {
      event.preventDefault();
      setOpen(true);
    }
  };

  const handleMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      buttonRef.current?.focus();
    }
  };

  const menu = open && typeof document !== 'undefined'
    ? createPortal(
      <div
        ref={menuRef}
        id={menuId}
        role="menu"
        tabIndex={-1}
        onClick={close}
        onKeyDown={handleMenuKeyDown}
        style={position ?? { visibility: 'hidden' }}
        data-test="dropdown-menu"
        className="fixed w-64 rounded-md shadow-lg z-[1000] outline-none"
      >
        <div className="rounded-md bg-gray-800 shadow-xs">
          <div className="py-1">{children}</div>
        </div>
      </div>,
      document.body,
    )
    : null;

  return (
    <div className={className}>
      <button
        ref={buttonRef}
        onClick={toggle}
        onKeyDown={handleButtonKeyDown}
        tabIndex={0}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        className={`flex p-2 text-sm rounded-md ${buttonHoverClassName} focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition ease-in-out duration-150`}
        data-test={dataTest}
      >
        {opener}
      </button>
      {menu}
    </div>
  );
};
