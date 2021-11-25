import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { ConfirmModal } from './index';

import { Switch } from '../common';

import state from '../../state';

function saveOptions(autoRendering = true) {
  state.template.merge({
    autoRendering,
  });
  localStorage.setItem('template-auto-rendering', JSON.stringify(autoRendering));
}

export const TemplateOptionsModal: React.FunctionComponent = () => {
  const templateState = state.useTemplateState();
  const [autoRendering, setAutoRendering] = useState(templateState.autoRendering.get());

  const onSubmit = () => {
    saveOptions(autoRendering);
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
      title={'Change renderer\'s options'}
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
      </div>
    </ConfirmModal>
  );
};
