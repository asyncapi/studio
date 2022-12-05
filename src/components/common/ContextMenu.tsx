import { 
  Menu,
  Item,
  Separator,
  Submenu,
} from "react-contexify";

import type { FunctionComponent } from 'react';
import type { MenuProps, ItemParams } from 'react-contexify';

interface ContextMenuProps extends Omit<MenuProps, 'theme'> {}

export const ContextMenu: FunctionComponent<ContextMenuProps> = ({
  children,
  ...props
}) => {
  return (
    <div>
      <Menu {...props} theme='asyncapi'>
        {children}
      </Menu>
    </div>
  );
};

export { Item, Separator, Submenu };
export type { ContextMenuProps, ItemParams };
