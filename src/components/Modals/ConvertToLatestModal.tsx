import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { ConfirmModal } from './ConfirmModal';

import { EditorService, SpecificationService } from '../../services';
import state from '../../state';

export const ConvertToLatestModal: React.FunctionComponent = () => {
  const [show, setShow] = useState(false);
  const [version, setVersion] = useState('');

  const specState = state.useSpecState();
  const parserState = state.useParserState();
  const shouldOpenConvertModal = specState.shouldOpenConvertModal.get();
  const forceConvertToLatest = specState.forceConvertToLatest.get();

  const actualVersion = parserState.parsedSpec.get()?.version() || '2.0.0-rc2';
  const latestVersion = SpecificationService.getLastVersion();
  let allowedVersions = Object.keys(SpecificationService.getSpecs());
  actualVersion && (allowedVersions.splice(0, allowedVersions.indexOf(actualVersion) + 1));
  const reservedAllowedVersions = allowedVersions.reverse();

  useEffect(() => {
    shouldOpenConvertModal && setShow(true);
  }, [shouldOpenConvertModal]);

  useEffect(() => {
    show === false && specState.shouldOpenConvertModal.set(false);
  }, [show]); // eslint-disable-line react-hooks/exhaustive-deps

  function onCancel() {
    setShow(false);
  }

  function onSubmit() {
    async function convert() {
      try {
        await EditorService.convertSpec(forceConvertToLatest ? latestVersion : version);
      } catch (e) {
        throw e;
      } finally {
        specState.shouldOpenConvertModal.set(false);
        setShow(false);
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
  };

  return (
    <ConfirmModal
      title={forceConvertToLatest ? 'Convert AsyncAPI document to latest version' : 'Convert AsyncAPI document to newest version'}
      confirmText={forceConvertToLatest ? `Convert to ${latestVersion}` : `Convert`}
      confirmDisabled={forceConvertToLatest ? false : !version || allowedVersions.length === 0}
      show={show}
      onSubmit={onSubmit}
      onCancel={onCancel}
    >
      <div className="flex flex-col content-center justify-center text-center">
        <p>
          {forceConvertToLatest 
            ? `Your document is using not latest version (${actualVersion}) of AsyncAPI. Convert your document to latest (${latestVersion}) version`
            : `Your document is using an old version (${actualVersion}) of AsyncAPI. The Studio only supports 2.0.0 and above. Convert your document to newest version to continue.`
          }
        </p>
        <ul className="mt-4">
          {reservedAllowedVersions.map(version => version !== '2.0.0' && (
            <li>
              <a
                className="underline"
                href={`https://www.asyncapi.com/blog/release-notes-${version}`}
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                See the release notes for {version}
              </a>
            </li>
          ))}
        </ul>
        {forceConvertToLatest === false ? (
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
        ) : null}
      </div>
    </ConfirmModal>
  );
};
