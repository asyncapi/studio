import React from 'react';
import { BaseModal } from './index';
import { VscSettingsGear } from 'react-icons/vsc';

export const SettingsModal: React.FunctionComponent = () => {
  return (
    <BaseModal
      title="Import AsyncAPI document from Base64"
      confirmText="Import"
      opener={
        <button className="flex text-md text-gray-500 hover:text-white focus:outline-none p-4">
          <VscSettingsGear className="h-5 w-5" />
        </button>
      }
    >
      <div className="flex content-center justify-center">Settings...</div>
    </BaseModal>
  );
};
