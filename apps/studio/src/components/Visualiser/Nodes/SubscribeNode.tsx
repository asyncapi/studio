import { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';

import { useServices } from '../../../services';
import getBackgroundColor from '../utils/random-background-color';

// @ts-ignore
import { Markdown } from '@asyncapi/react-component/lib/esm/components/Markdown';

import type { FunctionComponent } from 'react';

interface IData {
  messages: any []
  channel: string
  description: string
}

interface PublishNodeProps {
  data: IData
}

export const SubscribeNode: FunctionComponent<PublishNodeProps> = ({ data: { channel, description, messages } }) => {
  const { navigationSvc } = useServices();
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    return navigationSvc.highlightVisualiserNode(`#operation-subscribe-${channel}`, setHighlight);
  }, [navigationSvc, setHighlight]);

  return (
    <div className={`flex transition duration-500 ease-out shadow sm:rounded-lg border-2 ${highlight ? 'bg-green-200 border-green-700' : 'bg-white border-green-400'}`}>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: 'green' }}
      />
      <div className="px-4 py-5 sm:px-6 space-y-4">
        <div className="flex justify-between">
          <span className="block leading-6  text-gray-900 uppercase text-xs font-light">
            You can subscribe
          </span>
         
        </div>
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">{channel}</h3>
          {description && (
            <div className="mt-1 max-w-2xl text-sm text-gray-500">
              <Markdown>
                {description}
              </Markdown>
            </div>
          )}
        </div>
        <hr />
        <div>
          <span className="font-semibold block">
            Messages
          </span>
          <span className="text-xs block mb-3 italic mt-1 text-gray-500">
            Payloads to expect from listening to this channel
          </span>
          <div className="grid grid-cols-3 gap-4 px-2">
            {messages.map((message) => {
              return (
                <div
                  key={message.title}
                  className=" border-gray-200 border-l-8 border rounded-lg  space-x-2 flex justify-between"
                  style={
                    {
                      borderColor: getBackgroundColor(message.title),
                    }
                  }
                >
                  <div className="flex space-x-2">
                   
                    <div
                      className="p-2 font-semibold text-xs text-gray-800"
                      style={{ color: getBackgroundColor(message.title) }}
                    >
                      {message.title}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Left} id="a" style={{ background: 'orange' }} />
    </div>
  );
};

export default SubscribeNode;