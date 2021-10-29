// @ts-nocheck
/* eslint-disable */

import test from '../../examples/streetlights-kafka.yml'

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
  },
];

console.log('asddas', test)

const index = () => {
  return (
    <div className="bg-gray-800">
      <div className="max-w-5xl mx-auto py-10">
        <div className="flex">
          <div className="w-1/4 pr-10 space-y-4">
            <span className="uppercase text-white text-md font-bold">Welcome</span>
            <span className="block text-gray-300 text-xs leading-5">AsyncAPI specification is the industry standard for defining asynchronous APIs.</span>
            <span className="block text-gray-300 text-xs leading-5">
              At the heart of AsyncAPI is your specification file. AsyncAPI is protocol-agnostic and works over any protocol (e.g., AMQP, MQTT, WebSockets, Kafka, STOMP, HTTP, etc).
            </span>
            <span className="block text-gray-300 text-xs leading-5">To get started please select a template.</span>
          </div>
          <div className="px-4 w-3/4  overflow-scroll space-y-8 ">
            <div>
              <span className="uppercase text-gray-100 text-xs font-bold">Templates</span>
              <div className="grid grid-cols-2 gap-4 py-4">
                {templates.map(({ protocol, description: Description }) => {
                  return (
                    <div key={protocol} className="bg h-32 cursor-pointer rounded-lg p-4 transform transition duration-200 border-2 border-gray-400 hover:scale-105 hover:border-pink-500 bg-gray-100">
                      <span className="block text-md text-gray-800 font-bold">{protocol}</span>
                      <span className="block text-xs text-gray-500 font-light mt-1">
                        <Description />
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <span className="uppercase text-gray-100 text-xs font-bold">Real world Examples</span>
              <div className="grid grid-cols-2 gap-4 py-4">
                {realLifeExamples.map(({ protocol, description: Description }) => {
                  return (
                    <div key={protocol} className="bg h-32 cursor-pointer rounded-lg p-4 transform transition duration-200 border-2 border-gray-400 hover:scale-105 hover:border-pink-500 bg-gray-100">
                      <span className="block text-md text-gray-800  font-bold">{protocol}</span>
                      <span className="block text-xs text-gray-500 font-light mt-1">
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
    </div>
  );
};

export default index;
