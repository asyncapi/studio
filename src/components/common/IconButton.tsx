import { Tooltip } from './Tooltip';

import type { DetailedHTMLProps, ButtonHTMLAttributes, FunctionComponent, ReactNode } from "react";
import type { TooltipProps } from './Tooltip';

export interface IconButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  icon: ReactNode;
  tooltip?: TooltipProps;
}

export const IconButton: FunctionComponent<IconButtonProps> = ({
  icon,
  tooltip = {},
  ...rest
}) => {
  const button = (
    <button 
      type='button' 
      {...rest}
      className={`${rest.className || ''} flex items-center justify-center bg-inherit hover:bg-gray-600 active:bg-gray-500 text-gray-300 rounded p-0.5`}
    >
      {icon}
    </button>
  );

  if (!tooltip) {
    return button;
  }

  return (
    <Tooltip hideOnClick={true} {...tooltip}>
      {button}
    </Tooltip>
  )
}