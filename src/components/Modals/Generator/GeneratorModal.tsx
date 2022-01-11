import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';

import { ConfirmModal, ConfirmModalHandle } from '../index';

import { ServerAPIService } from '../../../services';

import state from '../../../state';

export const GeneratorModal: React.FunctionComponent = () => {
  const [template, setTemplate] = useState('');
  const [error, setError] = useState('');
  const ref = useRef<ConfirmModalHandle>(null);

  const generateTemplate = async () => {
    setError('');
    const status = await ServerAPIService.generate({
      asyncapi: state.editor.editorValue.get(),
      template,
    });
    if (status.ok) {
      ref.current?.close();
    } else {
      setError(status.statusText);
      throw new Error(status.statusText);
    }
  };

  const onSubmit = () => {
    toast.promise(generateTemplate(), {
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
      ref={ref}
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
      closeAfterSumbit={false}
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
            className="shadow-sm focus:ring-pink-500 focus:border-pink-500 w-1/2 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-1 text-gray-700 border-pink-300 border-2"
            onChange={e => {
              setTemplate(e.target.value);
            }}
            value={template}
          >
            <option value="">Please Select</option>
            {ServerAPIService.getTemplates().map(template => (
              <option key={template} value={template}>
                {template}
              </option>
            ))}
          </select>
        </div>
        <div className="flex content-center justify-center mt-4">
          {error}
        </div>
      </div>
    </ConfirmModal>
  );
};