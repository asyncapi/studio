import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { ConfirmModal } from './index';

import { GeneratorService, ServerAPIService } from '../../services';

export const GeneratorModal: React.FunctionComponent = () => {
  const [template, setTemplate] = useState('');

  const onSubmit = () => {
    toast.promise(ServerAPIService.generate({ template }), {
      loading: 'Generating...',
      success: (
        <div>
          <span className="block text-bold">
            Succesfully generated!
          </span>
        </div>
      ),
      error: (
        <div>
          <span className="block text-bold text-red-400">
            Failed to generate.
          </span>
        </div>
      ),
    });
  };

  return (
    <ConfirmModal
      title="Generate template based on AsyncAPI document"
      confirmText="Generate"
      confirmDisabled={!template}
      opener={
        <button
          type="button"
          className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150"
          title="Generate template"
        >
          Generate template
        </button>
      }
      onSubmit={onSubmit}
    >
      <div>
        <div className="flex content-center justify-center mt-4">
          <label
            htmlFor="template"
            className="flex justify-right items-center w-1/2 content-center font-medium text-gray-700"
          >
            Template:
          </label>
          <select
            name="template"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 rounded-md"
            onChange={e => {
              setTemplate(e.target.value);
            }}
            value={template}
          >
            <option value="">Please Select</option>
            {Object.entries(GeneratorService.getTemplates()).map(([shortName, template]) => (
              <option key={shortName} value={template}>
                {shortName}
              </option>
            ))}
          </select>
        </div>
      </div>
    </ConfirmModal>
  );
};
