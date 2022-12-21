import { Fragment, useRef, useCallback, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useModal } from '@ebay/nice-modal-react';

import { noop } from '../../helpers';

import type { ReactNode, FunctionComponent, PropsWithChildren } from 'react';

export interface PopoverProps extends PropsWithChildren {
  title: ReactNode;
  description?: ReactNode;
  confirmText?: ReactNode;
  cancelText?: ReactNode;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
}

export const Popover: FunctionComponent<PopoverProps> = ({
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm = noop,
  onCancel = noop,
  children,
}) => {
  const modal = useModal();
  const confirmButtonRef = useRef(null);

  const handleOnConfirm = useCallback(async () => {
    await onConfirm();
    modal.hide();
  }, [onConfirm, modal]);

  const handleOnCancel = useCallback(async () => {
    await onCancel();
    modal.hide();
  }, [onCancel, modal]);

  useEffect(() => {
    function listenerForEnter(event: KeyboardEvent) {
      if (event.key === "Enter") {
        handleOnConfirm();
      }
    }

    document.addEventListener('keyup', listenerForEnter);
    return () => {
      document.removeEventListener('keyup', listenerForEnter);
    };
  }, [handleOnConfirm]);

  const handleAfterLeave = useCallback(() => {
    modal.remove();
  }, []);

  return (
      <Transition.Root show={modal.visible} as={Fragment} afterLeave={handleAfterLeave}>
        <Dialog
          as="div"
          static
          className="fixed z-50 inset-0 overflow-y-auto"
          initialFocus={confirmButtonRef}
          open={modal.visible}
          onClose={handleOnCancel}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              {/* <Dialog.Panel> */}
                <div className='inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:p-6'>
                  <div>
                    <div>
                      <Dialog.Title
                        as="h3"
                        className="text-lg leading-6 font-medium text-gray-900"
                      >
                        {title}
                      </Dialog.Title>
                      {description && (
                        <Dialog.Description>
                          {description}
                        </Dialog.Description>
                      )}
                      <div className="my-8 space-y-4">{children}</div>
                    </div>
                  </div>
                  <div className='mt-5 sm:mt-6 sm:grid sm:gap-3 sm:grid-flow-row-dense'>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                      onClick={handleOnConfirm}
                      ref={confirmButtonRef}
                    >
                      {confirmText}
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                      onClick={handleOnCancel}
                    >
                      {cancelText}
                    </button>
                  </div>
                </div>
              {/* </Dialog.Panel> */}
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
  );
};
