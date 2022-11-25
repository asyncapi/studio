import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { ConfirmModal } from './ConfirmModal';

import { useServices } from '../../services';
import state from '../../state';

export const ConvertToLatestModal: React.FunctionComponent = () => {
  const [show, setShow] = useState(false);
  const [version, setVersion] = useState('');

  const { editorSvc, specificationSvc } = useServices();
  const specState = state.useSpecState();
  const parserState = state.useParserState();
  const shouldOpenConvertModal = specState.shouldOpenConvertModal.get();
  const convertOnlyToLatest = specState.convertOnlyToLatest.get();
  const forceConvert = specState.forceConvert.get();

  const actualVersion = parserState.parsedSpec.get()?.version() || '2.0.0-rc2';
  const latestVersion = specificationSvc.getLastVersion();
  const allowedVersions = Object.keys(specificationSvc.getSpecs());
  actualVersion && (allowedVersions.splice(0, allowedVersions.indexOf(actualVersion) + 1));
  const reservedAllowedVersions = [...allowedVersions].reverse();

  useEffect(() => {
    shouldOpenConvertModal && setShow(true);
  }, [shouldOpenConvertModal]);

  useEffect(() => {
    show === false && specState.shouldOpenConvertModal.set(false);
  }, [show]); // eslint-disable-line

  function onCancel() {
    setShow(false);
  }

  function onSubmit() {
    async function convert() {
      try {
        await editorSvc.convertSpec(convertOnlyToLatest ? latestVersion : version);
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
  }

  let content = '';
  if (convertOnlyToLatest) {
    content = `Your document is using not latest version of AsyncAPI. Convert your document to latest (${latestVersion}) version`;
  } else if (forceConvert) {
    content = 'Your document is using not supported version of AsyncAPI. Convert your document to newest version to continue.';
  } else {
    content = 'There is a new version of AsyncAPI. Convert your document to newest version if you want.';
  }

  return (
    <ConfirmModal
      title={convertOnlyToLatest ? 'Convert AsyncAPI document to latest version' : 'Convert AsyncAPI document to newest version'}
      confirmText={convertOnlyToLatest ? `Convert to ${latestVersion}` : 'Convert'}
      confirmDisabled={false}
      cancelDisabled={forceConvert}
      show={show}
      onSubmit={onSubmit}
      onCancel={onCancel}
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
};
