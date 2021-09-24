import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { BaseModal } from './BaseModal';

import { rockerLaunchImageBase64 } from '../misc';
import { EditorService, SpecificationService } from '../../services';
import state from '../../state';

export const ConvertToLatestModal: React.FunctionComponent = () => {
  const [show, setShow] = useState(false);
  const specState = state.useSpecState();
  const shouldOpenConvertModal = specState.shouldOpenConvertModal.get();

  const latestVersion = SpecificationService.getLastVersion();

  useEffect(() => {
    shouldOpenConvertModal && setShow(true);
  }, [shouldOpenConvertModal]);

  const onSubmit = () => {
    async function convert() {
      try {
        await EditorService.convertSpec();
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
    <BaseModal
      title="Convert AsyncAPI document to latest version"
      confirmText={`Convert to ${latestVersion}`}
      confirmDisabled={false}
      show={show}
      onSubmit={onSubmit}
    >
      <div className="flex flex-col content-center justify-center text-center">
        <div className="mx-auto">
          <img src={rockerLaunchImageBase64} className="w-96" alt="Rocket that will take you to the new version of AsyncAPI" />
        </div>
        <p>
          Your document is using an old version of AsyncAPI. The Studio only
          supports 2.0.0 and above. Convert your document to latest (
          {latestVersion}) version to continue.
        </p>
        <div className="mt-8">
          <a
            className="underline"
            href={`https://www.asyncapi.com/blog/release-notes-${latestVersion}`}
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            See the release notes
          </a>
        </div>
      </div>
    </BaseModal>
  );
};
