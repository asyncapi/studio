import { useState } from 'react';
import toast from 'react-hot-toast';
import { create } from '@ebay/nice-modal-react';

import { ConfirmModal } from './ConfirmModal';

import { useServices } from '../../services';
import { useDocumentsState } from '../../state';

interface ConvertToLatestModal {
  convertOnlyToLatest: boolean
}

export const ConvertToLatestModal = create<ConvertToLatestModal>(({ convertOnlyToLatest = false }) => {
  const [version, setVersion] = useState('');
  const { editorSvc, specificationSvc } = useServices();
  const document = useDocumentsState(state => state.documents['asyncapi']?.document);

  const actualVersion = document?.version() || '2.0.0-rc2';
  const latestVersion = specificationSvc.latestVersion;
  const allowedVersions = Object.keys(specificationSvc.specs);
  actualVersion && (allowedVersions.splice(0, allowedVersions.indexOf(actualVersion) + 1));
  const reservedAllowedVersions = [...allowedVersions].reverse();

  function onSubmit() {
    async function convert() {
      try {
        await editorSvc.convertSpec(version);
      } catch (err: any) {
        // intentionally
      }
    }

    toast.promise(convert(), {
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
  }

  let content = '';
  if (convertOnlyToLatest) {
    content = `Your document is using not latest version of AsyncAPI. Convert your document to latest (${latestVersion}) version`;
  } else {
    content = 'There is a new version of AsyncAPI. Convert your document to newest version if you want.';
  }

  return (
    <ConfirmModal
      title={convertOnlyToLatest ? 'Convert AsyncAPI document to latest version' : 'Convert AsyncAPI document to newest version'}
      confirmText={convertOnlyToLatest ? `Convert to ${latestVersion}` : 'Convert'}
      confirmDisabled={false}
      onSubmit={onSubmit}
    >
      <div className="flex flex-col content-center justify-center text-center">
        <p>
          {content}
        </p>
        <ul className="mt-4">
          {reservedAllowedVersions.map(v => v !== '2.0.0' && (
            <li key={v}>
              <a
                className="underline"
                href={`https://www.asyncapi.com/blog/release-notes-${v}`}
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                See the release notes for {v}
              </a>
            </li>
          ))}
        </ul>
        {convertOnlyToLatest === false ? (
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
              onChange={e => setVersion(e.target.value)}
              value={version}
            >
              <option value={latestVersion} key={latestVersion}>{latestVersion} (latest)</option>
              {reservedAllowedVersions.filter((v) => v !== latestVersion).map(v => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>
    </ConfirmModal>
  );
});
