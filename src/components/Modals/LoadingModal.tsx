import React, { Fragment, useState, useRef, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import state from '../../state';

interface LoadingModalProps {
  title: string;
}

export const LoadingModal: React.FunctionComponent<LoadingModalProps> = ({
  title = 'Loading...',
  children,
}) => {
  const editorState = state.useEditorState();
  const [showModal, setShowModal] = useState(!editorState.editorLoaded.get());
  const refDiv = useRef(null);

  useEffect(() => {
    setShowModal(!editorState.editorLoaded.get());
  }, [editorState.editorLoaded.get()]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Transition.Root show={showModal} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-50 inset-0 overflow-y-auto"
        open={showModal}
        initialFocus={refDiv}
        onClose={() => {}}
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
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              <div ref={refDiv}>
                <div>
                  <Dialog.Title
                    as="h2"
                    className="text-2xl leading-6 font-medium text-gray-900 text-center"
                  >
                    {title}
                  </Dialog.Title>
                  {children && <div className="my-8 space-y-4">{children}</div>}
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
