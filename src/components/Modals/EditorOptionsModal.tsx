import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { ConfirmModal } from './index';

import { Switch } from "../common";

import state from '../../state';

function saveOptions(autoSaving: boolean = true, savingDelay: number = 650) {
  state.editor.set({
    ...state.editor.get(),
    autoSaving,
    savingDelay,
  });
  localStorage.setItem('editor-auto-saving', JSON.stringify(autoSaving));
  localStorage.setItem('editor-saving-delay', JSON.stringify(savingDelay));
}

export const EditorOptionsModal: React.FunctionComponent = () => {
  const editorState = state.useEditorState();
  const [autoSaving, setAutoSaving] = useState(editorState.autoSaving.get());
  const [savingDelay, setSavingDelay] = useState(editorState.savingDelay.get());

  const onSubmit = () => {
    saveOptions(autoSaving, savingDelay);
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
      title={`Change editor's options`}
      confirmText="Save"
      confirmDisabled={false}
      opener={
        <button
          type="button"
          className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150"
          title="Editor's options"
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
            Auto saving:
          </label>
          <Switch
            toggle={autoSaving}
            callback={(v) => setAutoSaving(v)}
          />
        </div>
        {autoSaving && (
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
              onChange={e => setSavingDelay(JSON.parse(e.target.value))}
              value={savingDelay}
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
