import { useCallback } from 'react';
import { VscRadioTower } from 'react-icons/vsc'; 
import { show } from '@ebay/nice-modal-react';

import { ConvertToLatestModal } from '../Modals';

import { useServices } from '../../services';
import { useAppState, useDocumentsState, useFilesState, useSettingsState } from '../../state';

import type { FunctionComponent, MouseEvent as ReactMouseEvent } from 'react';

interface TerminalInfoProps {}

export const TerminalInfo: FunctionComponent<TerminalInfoProps> = () => {
  const { specificationSvc } = useServices();
  const file = useFilesState(state => state.files['asyncapi']);
  const document = useDocumentsState(state => state.documents['asyncapi']);
  const autoSaving = useSettingsState(state => state.editor.autoSaving);

  const liveServer = useAppState(state => state.liveServer);
  const actualVersion = document.document?.version() || '2.0.0';
  const latestVersion = specificationSvc.latestVersion;

  const onNonLatestClick = useCallback((e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    show(ConvertToLatestModal);
  }, []);

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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="inline-block h-5 w-5 mr-1 -mt-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
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
      {!autoSaving && file.modified && (
        <div className="ml-3">
          <span className="text-yellow-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="inline-block h-5 w-5 mr-1 -mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </span>
          <span>Modified</span>
        </div>
      )}
      <div className="ml-3">
        <span className="text-blue-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="inline-block h-5 w-5 mr-1 -mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </span>
        <span>{autoSaving ? 'Autosave: On' : 'Autosave: Off'}</span>
      </div>
      {actualVersion !== latestVersion && document.valid === true && (
        <div className="ml-3" onClick={onNonLatestClick}>
          <span className="text-yellow-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="inline-block h-5 w-5 mr-1 -mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
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
