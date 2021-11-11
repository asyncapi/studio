import examples from '../../examples';
import state from '../../state';

import {
  EditorService,
  SpecificationService
} from '../../services';

const NewFile = () => {
  const handleTemplateClick = (template: string) => {
    const panels = state.sidebar.panels;
    EditorService.updateState({ content: template });
    SpecificationService.parseSpec(template);
    panels.set({
      editor: true,
      navigation: true,
      newFile: false,
      view: true,
      viewType: 'template'
    });
  };

  const realLifeExamples = examples.filter((template) => template.type === 'real-example');
  const templates = examples.filter((template) => template.type === 'protocol-example');

  return (
    <div className="bg-gray-800 w-full">
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
                {templates.map(({ title, description: Description, template }) => {
                  return (
                    <button
                      onClick={() => handleTemplateClick(template)}
                      key={title}
                      className="pt-0 text-left  h-32 cursor-pointer rounded-lg p-4 transform transition duration-200 border-2 border-gray-400 hover:scale-105 hover:border-pink-500 bg-gray-100"
                    >
                      <span className="block text-md text-gray-800 font-bold">{title}</span>
                      <span className="block text-xs text-gray-500 font-light mt-1">
                        <Description />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <span className="uppercase text-gray-100 text-xs font-bold">Real world Examples</span>
              <div className="grid grid-cols-2 gap-4 py-4">
                {realLifeExamples.map(({ title, description: Description, template }) => {
                  return (
                    <button
                      onClick={() => handleTemplateClick(template)}
                      key={title}
                      className="pt-0 text-left  h-32 cursor-pointer rounded-lg p-4 transform transition duration-200 border-2 border-gray-400 hover:scale-105 hover:border-pink-500 bg-gray-100"
                    >
                      <span className="block text-md text-gray-800  font-bold">{title}</span>
                      <span className="block text-xs text-gray-500 font-light mt-1">
                        <Description />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <span className=" text-xs block text-white ">
              Don&apos;t see what you&apos;re looking for? <span className="underline text-pink-500">Request a template or add one to the list &rarr;</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewFile;
