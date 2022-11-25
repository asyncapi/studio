import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { VscSettingsGear } from 'react-icons/vsc';

import { SettingsTabs, SettingTab } from './SettingsTabs';

import { ConfirmModal } from '../index';
import { Switch, Tooltip } from '../../common';

import { isDeepEqual } from '../../../helpers';
import { useServices } from '../../../services';

import state from '../../../state';

import type { SettingsState } from '../../../state/settings';

interface ShowGovernanceOptionProps {
  label: 'warning' | 'information' | 'hint';
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShowGovernanceOption: React.FunctionComponent<ShowGovernanceOptionProps> = ({
  label,
  state,
  setState
}) => {
  return (
    <div>
      <div className="flex flex-col mt-4 text-sm">
        <div className="flex flex-row content-center justify-between">
          <label
            htmlFor={`settings-governance-show-${label}`}
            className="flex justify-right items-center w-1/2 content-center font-medium text-gray-700"
          >
            Show&nbsp;<strong>{label}</strong>&nbsp;governance issues
          </label>
          <Switch
            toggle={state}
            onChange={setState}
          />
        </div>
        <div className='text-gray-400 text-xs'>
          Show {label} governance issues in the editor&apos;s&nbsp;<strong>Diagnostics</strong>&nbsp;tab.
        </div>
      </div>
    </div>
  );
};

export const SettingsModal: React.FunctionComponent = () => {
  const { editorSvc } = useServices();
  const settingsState = state.useSettingsState();
  const [autoSaving, setAutoSaving] = useState(settingsState.editor.autoSaving.get());
  const [savingDelay, setSavingDelay] = useState(settingsState.editor.savingDelay.get());
  const [governanceWarnings, setGovernanceWarnings] = useState(settingsState.governance.show.warnings.get());
  const [governanceInformations, setGovernanceInformations] = useState(settingsState.governance.show.informations.get());
  const [governanceHints, setGovernanceHints] = useState(settingsState.governance.show.hints.get());
  const [autoRendering, setAutoRendering] = useState(settingsState.templates.autoRendering.get());
  const [confirmDisabled, setConfirmDisabled] = useState(true);

  useEffect(() => {
    const newState: Partial<SettingsState> = {
      editor: {
        autoSaving,
        savingDelay,
      },
      governance: {
        show: {
          warnings: governanceWarnings,
          informations: governanceInformations,
          hints: governanceHints,
        },
      },
      templates: {
        autoRendering,
      }
    }; 
    let oldState: Partial<SettingsState> = JSON.parse(localStorage.getItem('studio-settings') || '');
    oldState = {
      editor: oldState.editor,
      governance: oldState.governance,
      templates: oldState.templates,
    };

    const isThisSameObjects = isDeepEqual(newState, oldState);
    setConfirmDisabled(isThisSameObjects);
  }, [autoSaving, savingDelay, autoRendering, governanceWarnings, governanceInformations, governanceHints]);

  const saveOptions = (settings: Partial<SettingsState> = {}) => {
    settingsState.merge({
      ...settings,
    });
    localStorage.setItem('studio-settings', JSON.stringify(settingsState.get()));
  };

  const onCancel = () => {
    settingsState.merge({
      showModal: false,
      activeTab: '',
    });
  };

  const onSubmit = () => {
    saveOptions({
      editor: {
        autoSaving,
        savingDelay,
      },
      governance: {
        show: {
          warnings: governanceWarnings,
          informations: governanceInformations,
          hints: governanceHints,
        }
      },
      templates: {
        autoRendering,
      }
    });

    editorSvc.applyMarkers(state.parser.diagnostics.get());
    setConfirmDisabled(true);
    toast.success(
      <div>
        <span className="block text-bold">
          Settings succesfully saved!
        </span>
      </div>
    );
    onCancel();
  };

  const tabs: Array<SettingTab> = [
    {
      name: 'Editor',
      tab: <span>Editor</span>,
      content: (
        <div>
          <div className="flex flex-col mt-4 text-sm">
            <div className="flex flex-row content-center justify-between">
              <label
                htmlFor="settings-auto-saving"
                className="flex justify-right items-center w-1/2 content-center font-medium text-gray-700"
              >
                Auto saving
              </label>
              <Switch
                toggle={autoSaving}
                onChange={(v) => setAutoSaving(v)}
              />
            </div>
            <div className='text-gray-400 text-xs'>
              Save automatically after each change in the document or manually.
            </div>
          </div>
          <div className={`flex flex-col mt-4 text-sm pl-8 ${autoSaving ? 'opacity-1' : 'opacity-25'}`}>
            <div className="flex flex-row content-center justify-between">
              <label
                htmlFor="settings-template-delay"
                className="flex justify-right items-center w-1/2 content-center font-medium text-gray-700"
              >
                Delay (in miliseconds)
              </label>
              <select
                name="settings-template-delay"
                className="shadow-sm focus:ring-pink-500 focus:border-pink-500 w-1/4 block sm:text-sm rounded-md py-2 px-1 text-gray-700 border-pink-300 border-2"
                onChange={e => setSavingDelay(JSON.parse(e.target.value))}
                value={autoSaving ? savingDelay : ''}
                disabled={!autoSaving}
              >
                <option value="">Please Select</option>
                {[250, 500, 625, 750, 875, 1000].map(v => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div className='text-gray-400 text-xs -mt-2'>
              Delay in saving the modified document.
            </div>
          </div>
        </div>
      ),
    },
    {
      name: 'Governance',
      tab: <span>Governance</span>,
      content: (
        <>
          <ShowGovernanceOption label='warning' state={governanceWarnings} setState={setGovernanceWarnings} />
          <ShowGovernanceOption label='information' state={governanceInformations} setState={setGovernanceInformations} />
          <ShowGovernanceOption label='hint' state={governanceHints} setState={setGovernanceHints} />
        </>
      ),
    },
    {
      name: 'Templates',
      tab: <span>Templates</span>,
      content: (
        <div>
          <div className="flex flex-col mt-4 text-sm">
            <div className="flex flex-row content-center justify-between">
              <label
                htmlFor="asyncapi-version"
                className="flex justify-right items-center w-1/2 content-center font-medium text-gray-700"
              >
                Auto rendering
              </label>
              <Switch
                toggle={autoRendering}
                onChange={(v) => setAutoRendering(v)}
              />
            </div>
          </div>
          <div className='text-gray-400 text-xs'>
            Automatic rendering after each change in the document or manually.
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
      show={settingsState.showModal.get()}
      opener={
        <Tooltip content='Studio settings' placement='right' hideOnClick={true}>
          <button
            title="Studio settings"  
            className='flex text-gray-500 hover:text-white focus:outline-none border-box p-4'
            type="button"  
          >
            <VscSettingsGear className="w-5 h-5" />
          </button>
        </Tooltip>
      }
      onSubmit={onSubmit}
      onCancel={onCancel}
    >
      <SettingsTabs tabs={tabs} />
    </ConfirmModal>
  );
};
