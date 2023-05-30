import { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';

import { useServices } from '../../../services';
import getBackgroundColor from '../utils/random-background-color';

// @ts-ignore
import { Markdown } from '@asyncapi/react-component/lib/esm/components/Markdown';

import type React from 'react';

interface IData {
  messages: any[];
  channel: string
  description: string
}

interface PublishNodeProps {
  data: IData
}

export const PublishNode: React.FunctionComponent<PublishNodeProps> = ({
  data: { messages = [], channel, description },
}) => {
  const { navigationSvc } = useServices();
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    return navigationSvc.highlightVisualiserNode(`#operation-publish-${channel}`, setHighlight);
  }, [navigationSvc, setHighlight]);

  return (
    <div className={`flex transition duration-500 ease-out shadow sm:rounded-lg border-2 ${highlight ? 'bg-blue-100 border-blue-700' : 'bg-white border-blue-400'}`}>
      <div className="px-4 py-5 sm:px-6 space-y-4">
        <span className="block leading-6  text-gray-900 text-xs font-light uppercase">You can publish</span>
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
            Payloads you can publish using this channel
          </span>
          <div className="grid grid-cols-3 gap-4 px-2">
            {messages.map((message) => {
              const theme = getBackgroundColor(message.title);

              return (
                <div
                  key={message.title}
                  className=" p-2 border-gray-200 border border-l-8 rounded-lg space-x-2 flex justify-between"
                  style={{
                    borderColor: theme,
                  }}
                >
                  <div className="flex space-x-2">
                    <div
                      className="font-semibold text-gray-800 text-xs"
                      style={{ color: theme }}
                    >
                      {message.title}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Handle
          type="source"
          position={Position.Right}
          style={{ background: 'green' }}
        />
      </div>
    </div>
  );
};

export default PublishNode;