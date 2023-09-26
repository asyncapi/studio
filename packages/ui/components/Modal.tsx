import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import type { ReactNode, FunctionComponent, PropsWithChildren } from 'react';

interface ModalProps {
  title: ReactNode;
  description?: ReactNode;
  okText?: ReactNode;
  cancelText?: ReactNode;
  okDisabled?: boolean;
  cancelDisabled?: boolean;
  containerClassName? : string;
  onSubmit?: () => void;
  onCancel?: () => void;
}

export const Modal: FunctionComponent<PropsWithChildren<ModalProps>> = ({
  title,
  description,
  okText = 'Save',
  cancelText = 'Cancel',
  okDisabled = true,
  cancelDisabled = false,
  onSubmit = () => {},
  onCancel = () => {},
  containerClassName = '',
  children,
}) => {
  const cancelButtonRef = useRef(null);

  return (
    <>
      <Transition.Root show={true} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed z-50 inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
          open={true}
          onClose={onCancel}
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
              <div className={`inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6 ${containerClassName}`}>
                <div>
                  <div>
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      {title}
                    </Dialog.Title>
                    {description && (
                      <p className="text-gray-500 text-xs">{description}</p>
                    )}
                    <div className="my-8 space-y-4">{children}</div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:gap-3 sm:grid-flow-row-dense sm:grid-cols-2">
                  <button
                    type="button"
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:col-start-2 sm:text-sm ${
                      okDisabled ? 'opacity-10' : 'opacity-100'
                    }`}
                    disabled={okDisabled}
                    onClick={onSubmit}
                  >
                    {okText}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    onClick={onCancel}
                    disabled={cancelDisabled}
                    ref={cancelButtonRef}
                  >
                    {cancelText}
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};
