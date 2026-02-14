import { Fragment, useRef, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useModal } from "@ebay/nice-modal-react";

import type { ReactNode, FunctionComponent, PropsWithChildren } from "react";

interface ConfirmModalProps {
  title: ReactNode;
  description?: ReactNode;
  warning?: ReactNode;
  link?: string;
  confirmText?: ReactNode;
  cancelText?: ReactNode;
  confirmDisabled?: boolean;
  cancelDisabled?: boolean;
  containerClassName?: string;
  closeAfterSumbit?: boolean;
  onSubmit?: () => void;
  onCancel?: () => void;
}

export const ConfirmModal: FunctionComponent<
  PropsWithChildren<ConfirmModalProps>
> = ({
  title,
  description,
  warning,
  link,
  confirmText = "Save",
  cancelText = "Cancel",
  confirmDisabled = true,
  cancelDisabled = false,
  closeAfterSumbit = true,
  onSubmit,
  onCancel = () => {
    // This is intentional
  },
  containerClassName,
  children,
}) => {
  const modal = useModal();
  const cancelButtonRef = useRef(null);

  const handleOnSubmit = () => {
    onSubmit && onSubmit();
    if (closeAfterSumbit) {
      modal.hide();
    }
  };

  const handleOnCancel = () => {
    onCancel();
    modal.hide();
  };

  const handleAfterLeave = useCallback(() => {
    modal.remove();
  }, []);

  return (
    <>
      <Transition.Root
        show={modal.visible}
        as={Fragment}
        afterLeave={handleAfterLeave}
      >
        <Dialog
          as="div"
          static
          className="fixed z-50 inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
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
              <div
                className={`inline-block align-bottom bg-[#1a1a1a] rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-2/5 sm:p-6 ${containerClassName}`}
              >
                <div>
                  <div>
                    <Dialog.Title
                      as="h3"
                      className="text-xl leading-7 font-semibold text-white mb-2"
                    >
                      {title}
                    </Dialog.Title>
                    {description && (
                      <p className="text-white text-sm mt-1">{description}</p>
                    )}
                    {warning && (
                      <a
                        href={link}
                        className="text-red-400 text-sm underline hover:text-red-300 mt-2 inline-block"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {warning}
                      </a>
                    )}
                    <div className="my-8 space-y-4">{children}</div>
                  </div>
                </div>
                <div
                  className={`mt-5 sm:mt-6 sm:grid sm:gap-3 sm:grid-flow-row-dense ${onSubmit ? "sm:grid-cols-2" : ""}`}
                >
                  {onSubmit && (
                    <button
                      type="button"
                      className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-pink-500 sm:col-start-2 sm:text-sm transition-colors ${confirmDisabled ? "opacity-40 cursor-not-allowed" : "opacity-100"}`}
                      disabled={confirmDisabled}
                      onClick={handleOnSubmit}
                      data-test="modal-confirm-button"
                    >
                      {confirmText}
                    </button>
                  )}
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-800 text-base font-medium text-gray-200 hover:bg-gray-700 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500 sm:mt-0 sm:col-start-1 sm:text-sm transition-colors"
                    onClick={handleOnCancel}
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
