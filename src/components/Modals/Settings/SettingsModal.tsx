import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { VscSettingsGear } from 'react-icons/vsc';

import { SettingsTabs, SettingTab } from './SettingsTabs';

import { ConfirmModal } from '../index';
import { Switch } from '../../common';

import state from '../../../state';
import { SettingsState } from '../../../state/settings';

function saveOptions(settings: SettingsState = {} as any) {
  state.settings.merge({
    ...settings,
  });
  localStorage.setItem('studio-settings', JSON.stringify(state.settings.get()));
}

export const SettingsModal: React.FunctionComponent = () => {
  const settingsState = state.useSettingsState();
  const [autoSaving, setAutoSaving] = useState(settingsState.editor.autoSaving.get());
  const [savingDelay, setSavingDelay] = useState(settingsState.editor.savingDelay.get());
  const [autoRendering, setAutoRendering] = useState(settingsState.templates.autoRendering.get());
  const [confirmDisabled, setConfirmDisabled] = useState(true);

  useEffect(() => {
    const disable = JSON.stringify({
      editor: {
        autoSaving,
        savingDelay,
      },
      templates: {
        autoRendering,
      }
    }) === localStorage.getItem('studio-settings');
    setConfirmDisabled(disable);
  }, [autoSaving, savingDelay, autoRendering]);

  const onSubmit = () => {
    saveOptions({
      editor: {
        autoSaving,
        savingDelay,
      },
      templates: {
        autoRendering,
      }
    });
    toast.success(
      <div>
        <span className="block text-bold">
          Settings succesfully saved!
        </span>
      </div>
    );
  };

  const tabs: Array<SettingTab> = [
    {
      name: 'Editor',
      tab: <span>Editor</span>,
      content: (
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
      ),
    },
    {
      name: 'Templates',
      tab: <span>Templates</span>,
      content: (
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
      ),
    },
  ];

  return (
    <ConfirmModal
      title={'Studio settings'}
      confirmText="Save"
      confirmDisabled={confirmDisabled}
      opener={
        <button
          className={'flex text-xl border-l-2 text-gray-500 hover:text-white border-gray-800 focus:outline-none border-box p-4'}
          type="button"
        >
          <VscSettingsGear />
        </button>
      }
      onSubmit={onSubmit}
    >
      <SettingsTabs tabs={tabs} />
    </ConfirmModal>
  );
};
