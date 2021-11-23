import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { ConfirmModal } from './index';

import { Switch } from "../common";

import state from '../../state';

function saveOptions(autoRendering: boolean = true, renderingDelay: number = 650) {
  state.template.set({
    ...state.template.get(),
    autoRendering,
    renderingDelay,
  });
  localStorage.setItem('template-auto-rendering', JSON.stringify(autoRendering));
  localStorage.setItem('template-rendering-delay', JSON.stringify(renderingDelay));
}

export const TemplateOptionsModal: React.FunctionComponent = () => {
  const templateState = state.useTemplateState();
  const [autoRendering, setAutoRendering] = useState(templateState.autoRendering.get());
  const [renderingDelay, setRenderingDelay] = useState(templateState.renderingDelay.get());

  const onSubmit = () => {
    saveOptions(autoRendering, renderingDelay);
    toast.success(
      <div>
        <span className="block text-bold">
          Options succesfully saved!
        </span>
      </div>
    );
  };

  return (
    <ConfirmModal
      title={`Change renderer's options`}
      confirmText="Save"
      confirmDisabled={false}
      opener={
        <button
          type="button"
          className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150"
          title="Renderer's options"
        >
          Options
        </button>
      }
      onSubmit={onSubmit}
    >
      <div>
        <div className="flex content-center justify-between mt-4">
          <label
            htmlFor="asyncapi-version"
            className="flex justify-right items-center w-1/2 content-center font-medium text-gray-700"
          >
            Auto rendering:
          </label>
          <Switch
            toggle={autoRendering}
            callback={(v) => setAutoRendering(v)}
          />
        </div>
        {autoRendering && (
          <div className="flex content-center justify-center mt-4">
            <label
              htmlFor="template-delay"
              className="flex justify-right items-center w-1/2 content-center font-medium text-gray-700"
            >
              Delay (in miliseconds):
            </label>
            <select
              name="asyncapi-version"
              className="shadow-sm focus:ring-pink-500 focus:border-pink-500 w-1/2 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-1 text-gray-700 border-pink-300 border-2"
              onChange={e => setRenderingDelay(JSON.parse(e.target.value))}
              value={renderingDelay}
            >
              <option value="">Please Select</option>
              {[250, 500, 625, 750, 875, 1000].map(v => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </ConfirmModal>
  );
};
