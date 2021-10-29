// @ts-nocheck
/* eslint-disable */

/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

// import options from '../../data/application-list'

const templates = [
  {
    protocol: 'Apache Kafka',
    description: () => <> A framework implementation of a software bus using stream-processing. Open Source developed by the Apache Software Foundation.</>,
  },
  {
    protocol: 'WebSocket',
    description: () => <>A computer communications protocol, providing full-duplex communication channels over a single TCP connection.</>,
  },
  {
    protocol: 'HTTP',
    description: () => <>A protocol for fetching resources. It is the foundation of any data exchange on the Web and it is a client-server protocol.</>,
  },
  {
    protocol: 'MQTT',
    description: () => <>A protocol for fetching resources. It is the foundation of any data exchange on the Web and it is a client-server protocol.</>,
  },
  {
    protocol: 'Other',
    description: () => <>Our basic template to help you get started. Not linked to any protocol but let's you explore AsyncAPI.</>,
  },
];

const realLifeExamples = [
  {
    protocol: 'Airport System',
    description: () => <> An Airport event system modelled with AsyncAPI. Protocol is Kafka.</>,
  },
  {
    protocol: 'Chat application',
    description: () => <>Chat application that handles messages between people. Users can publish messages between them and listen for changes. Protocol Websockets</>,
  }
];

export default function NodeSelector({ isOpen, onClose = () => {}, onApplicationSelection = () => {} }) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={onClose}>
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
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
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden overflow-y-auto shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full sm:p-6 h-96">
              <div className="flex">
                <div className="w-1/4 pr-10 space-y-4">
                  <span className="uppercase text-gray-800 text-xs font-bold">Welcome</span>

                  <span className="block text-gray-600 text-xs leading-5">AsyncAPI specification is the industry standard for defining asynchronous APIs.</span>

                  <span className="block text-gray-600 text-xs leading-5">
                    At the heart of AsyncAPI is your specification file. AsyncAPI is protocol-agnostic and works over any protocol (e.g., AMQP, MQTT, WebSockets, Kafka, STOMP, HTTP, etc).
                  </span>

                  <span className="block text-gray-600 text-xs leading-5">To get started with the studio, please select a template from the list of templates.</span>
                </div>
                <div className="px-4 w-3/4  overflow-scroll space-y-8 ">
                  <div>
                    <span className="uppercase text-gray-800 text-xs font-bold">Templates</span>
                    <div className="grid grid-cols-2 gap-4 py-4">
                      {templates.map(({ protocol, description: Description }) => {
                        return (
                          <div
                            key={protocol}
                            className="bg h-32 cursor-pointer rounded-lg p-4 transform transition duration-200 border-2 border-gray-200 hover:scale-105 hover:border-pink-500"
                            onClick={() => onApplicationSelection({ protocol })}
                          >
                            <span className="block text-md text-pink-600 font-bold">{protocol}</span>
                            <span className="block text-xs text-gray-600 font-light mt-1">
                              <Description />
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <span className="uppercase text-gray-800 text-xs font-bold">Real world Examples</span>
                    <div className="grid grid-cols-2 gap-4 py-4">
                      {realLifeExamples.map(({ protocol, description: Description }) => {
                        return (
                          <div
                            key={protocol}
                            className="bg h-32 cursor-pointer rounded-lg p-4 transform transition duration-200 border-2 border-gray-200 hover:scale-105 hover:border-pink-500"
                            onClick={() => onApplicationSelection({ protocol })}
                          >
                            <span className="block text-md text-pink-600 font-bold">{protocol}</span>
                            <span className="block text-xs text-gray-600 font-light mt-1">
                              <Description />
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
