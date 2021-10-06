import React from 'react';

import { SpecificationService } from '../../services';
import state from '../../state';

interface TerminalInfoProps {}

export const TerminalInfo: React.FunctionComponent<TerminalInfoProps> = () => {
  const editorState = state.useEditorState();
  const parserState = state.useParserState();

  const actualVersion = parserState.parsedSpec.get()?.version() || '2.0.0';
  const latestVersion = SpecificationService.getLastVersion();
  const errors = parserState.errors.get();

  function onNonLatestClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    state.spec.set({
      shouldOpenConvertModal: true,
      convertOnlyToLatest: true,
      forceConvert: false,
    });
  }

  return (
    <div className="flex flex-row px-2">
      {errors.length ? (
        <div>
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
        <div>
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
      {actualVersion !== latestVersion && (
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
        <span>{editorState.language.get()}</span>
      </div>
    </div>
  );
};
