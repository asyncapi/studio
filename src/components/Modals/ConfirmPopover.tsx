import { create } from '@ebay/nice-modal-react';

import { Popover } from './index';

import type { PopoverProps } from './Popover';

export const ConfirmPopover = create<PopoverProps>(({
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  children,
}) => {
  return (
    <Popover
      title={title}
      description={description}
      confirmText={confirmText}
      cancelText={cancelText}
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      {children}
    </Popover>
  );
});
