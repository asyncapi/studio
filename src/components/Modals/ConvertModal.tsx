import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { ConfirmModal } from './index';

import { EditorService, SpecificationService } from '../../services';
import state from '../../state';

export const ConvertModal: React.FunctionComponent = () => {
  const [version, setVersion] = useState('');
  const parserState = state.useParserState();

  const actualVersion = parserState.parsedSpec.get()?.version();
  const latestVersion = SpecificationService.getLastVersion();
  const allowedVersions = Object.keys(SpecificationService.getSpecs());
  actualVersion && (allowedVersions.splice(0, allowedVersions.indexOf(actualVersion) + 1));
  const reservedAllowedVersions = allowedVersions.reverse();

  const onSubmit = () => {
    toast.promise(EditorService.convertSpec(version), {
      loading: 'Converting...',
      success: (
        <div>
          <span className="block text-bold">
            Document succesfully converted!
          </span>
        </div>
      ),
      error: (
        <div>
          <span className="block text-bold text-red-400">
            Failed to convert document.
          </span>
        </div>
      ),
    });
  };

  return (
    <ConfirmModal
      title={`Convert AsyncAPI ${actualVersion} document`}
      confirmText="Convert"
      confirmDisabled={!version || allowedVersions.length === 0}
      opener={
        <button
          type="button"
          className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150"
          title="Convert AsyncAPI document"
        >
          Convert document
        </button>
      }
      onSubmit={onSubmit}
    >
      <div>
        {allowedVersions.length > 0 ? (
          <div className="flex content-center justify-center mt-4">
            <label
              htmlFor="asyncapi-version"
              className="flex justify-right items-center w-1/2 content-center font-medium text-gray-700"
            >
              To version:
            </label>
            <select
              name="asyncapi-version"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 rounded-md"
              onChange={e => setVersion(e.target.value)}
              value={version}
            >
              <option value="">Please Select</option>
              {reservedAllowedVersions.map(v => (
                <option key={v} value={v}>
                  {v === latestVersion ? `${v} (latest)` : v}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex content-center justify-center">Uses the latest version.</div>
        )}
      </div>
    </ConfirmModal>
  );
};
