import { useCallback } from 'react';
import { VscRadioTower } from 'react-icons/vsc'; 
import { show } from '@ebay/nice-modal-react';
import { AlertIcon, ErrorIcon } from '@asyncapi/studio-ui/icons';

import { ConvertToLatestModal } from '../Modals';

import { useServices } from '../../services';
import { useAppState, useDocumentsState, useFilesState } from '../../state';

import type { FunctionComponent } from 'react';

interface TerminalInfoProps {}

export const TerminalInfo: FunctionComponent<TerminalInfoProps> = () => {
  const { specificationSvc } = useServices();
  const file = useFilesState(state => state.files['asyncapi']);
  const document = useDocumentsState(state => state.documents['asyncapi']);
  const liveServer = useAppState(state => state.liveServer);

  const onNonLatestClick = useCallback((e: {stopPropagation: ()=>void}) => {
    e.stopPropagation();
    show(ConvertToLatestModal);
  }, []);

  if (!document) {
    return null;
  }
  const actualVersion = document.document?.version() || '2.0.0';
  const latestVersion = specificationSvc.latestVersion;

  return (
    <div className="flex flex-row px-2">
      {liveServer && (
        <div className="flex flex-row content-center ml-3">
          <span className="inline-block mr-2">
            <VscRadioTower className="w-4 h-4 text-yellow-500" />
          </span>
          <span>Live server</span>
        </div>
      )}
      {document.diagnostics.errors.length > 0 ? (
        <div className="ml-3">
          <span className="text-red-500">
            <ErrorIcon className="inline-block h-5 w-5 mr-1 -mt-0.5" />
          </span>
          <span>Invalid</span>
        </div>
      ) : (
        <div className="ml-3">
          <span className="text-green-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="inline-block h-5 w-5 mr-1 -mt-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <span>Valid</span>
        </div>
      )}
      {file.modified && (
        <div className="ml-3">
          <span className="text-yellow-500">
            <AlertIcon className="inline-block h-5 w-5 mr-1 -mt-0.5" />
          </span>
          <span>Unsaved changes</span>
        </div>
      )}
      {actualVersion !== latestVersion && document.valid === true && (
        <div className="ml-3" 
          onClick={onNonLatestClick}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') onNonLatestClick(event);
          }}>
          <span className="text-yellow-500">
            <AlertIcon className="inline-block h-5 w-5 mr-1 -mt-0.5" />
          </span>
          <span>Not latest</span>
        </div>
      )}
      <div className="ml-3">
        <span>{file.language}</span>
      </div>
    </div>
  );
};
