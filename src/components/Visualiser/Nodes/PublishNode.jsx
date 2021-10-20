import { Handle } from 'react-flow-renderer';

const getBackgroundColor = (stringInput) => {
  const stringUniqueHash = [...stringInput].reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  return `hsla(${stringUniqueHash % 360}, 95%, 35%, 0.5)`;
};

export default function PublishNode({
  // eslint-disable-next-line react/prop-types
  data: { title, messages = [], channel, description, schema, example, model },
}) {
  return (
    <div className="bg-white shadow sm:rounded-lg border-2 border-green-400">
      <div className="px-4 py-5 sm:px-6 space-y-4">
        <span className="block leading-6  text-gray-900 text-xs font-light">YOU CAN PUBLISH</span>
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">{channel}</h3>
          {description && <p className="mt-1 max-w-2xl text-sm text-gray-500">{description}</p>}
        </div>
        <hr />
        <div>
          <span className="font-semibold block">
            Messages
            {/* <MailIcon className="text-gray-500 w-4 inline-block ml-1 -mt-1" /> */}
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
                    'border-color': theme,
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
                  {/* <DotsVerticalIcon
                    className="text-gray-500 w-4"
                    style={{ color: theme }}
                  /> */}
                  {/* <span className="mt-1 block text-xs w-40">{message.description}</span> */}
                </div>
              );
            })}
          </div>
        </div>

        <Handle
          type="source"
          position="right"
          style={{ background: 'green' }}
          onConnect={(params) => console.log('handle onConnect', params)}
        ></Handle>
      </div>
    </div>
  );
}
