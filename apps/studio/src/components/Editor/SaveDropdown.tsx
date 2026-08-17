import React from 'react';
import toast from 'react-hot-toast';
import { SaveIcon } from '@asyncapi/studio-ui/icons';

import { Tooltip } from '../common';
import { useServices } from '@/services';
import { useFilesState } from '../../state';

export const SaveButton: React.FC = () => {
  const { editorSvc } = useServices();
  const file = useFilesState(state => state.files['asyncapi']);
  const isDirectSave = file?.from === 'file' && !!file?.fileHandle;
  const baseLabel = isDirectSave ? 'Save' : 'Export';
  const tooltipText = file?.modified ? baseLabel : `${baseLabel} (saved)`;

  return (
    <Tooltip content={tooltipText} placement="top" hideOnClick={true}>
      <button
        type="button"
        className="flex bg-inherit p-2 disabled:cursor-not-allowed"
        title={tooltipText}
        onClick={() => {
          toast.promise(
            editorSvc.saveCurrentFile(),
            {
              loading: 'Saving...',
              success: (
                <div>
                  <span className="block text-bold">
                    Document succesfully saved!
                  </span>
                </div>
              ),
              error: (
                <div>
                  <span className="block text-bold text-red-400">
                    Failed to save document.
                  </span>
                </div>
              ),
            },
          );
        }}
        disabled={!file?.modified}
        data-test="button-save-dropdown"
      >
        <SaveIcon
          className={
            file?.modified
              ? 'w-4 h-4 text-gray-500 hover:text-white'
              : 'w-4 h-4 text-gray-600'
          }
        />
      </button>
    </Tooltip>
  );
};
