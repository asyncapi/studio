import { useState } from 'react';
import toast from 'react-hot-toast';
import { create } from '@ebay/nice-modal-react';

import { ConfirmModal } from './index';

import { useServices } from '../../services';
import { useDocumentsState } from '../../state';

import type { SpecVersions } from '../../types';

export const ConvertModal = create(() => {
  const { editorSvc, specificationSvc } = useServices();
  const document = useDocumentsState(state => state.documents['asyncapi']?.document);
  const latestVersion = specificationSvc.latestVersion;
  
  const [version, setVersion] = useState(latestVersion);
  const actualVersion = document?.version();
  const allowedVersions = Object.keys(specificationSvc.specs);
  actualVersion && (allowedVersions.splice(0, allowedVersions.indexOf(actualVersion) + 1));
  const reservedAllowedVersions = [...allowedVersions].reverse();

  const onSubmit = () => {
    toast.promise(editorSvc.convertSpec(version), {
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
              className="shadow-sm focus:ring-pink-500 focus:border-pink-500 w-1/2 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-1 text-gray-700 border-pink-300 border-2"
              onChange={e => setVersion(e.target.value as SpecVersions)}
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
});
