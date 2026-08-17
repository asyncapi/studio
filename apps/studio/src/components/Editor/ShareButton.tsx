import React from 'react';
import { ShareIcon } from '@asyncapi/studio-ui/icons';
import { useServices } from '../../services';
import { toast } from 'react-hot-toast';
import { Tooltip } from '../common';

interface ShareButtonProps {}

export const ShareButton: React.FunctionComponent<ShareButtonProps> = () => {
  const { editorSvc } = useServices();

  const handleShare = () => {
    toast.promise(
      (async function () {
        const url = await editorSvc.exportAsURL();
        await navigator.clipboard.writeText(url);
      }()),
      {
        loading: 'Copying URL to clipboard...',
        success: 'URL copied to clipboard!',
        error: 'Failed to share the AsyncAPI document.',
      }
    );
  };

  return (
    <Tooltip content={'Share link'} placement="top" hideOnClick={true}>
      <button className="flex bg-inherit p-2" onClick={handleShare} data-test="button-share">
        <ShareIcon className="w-4 h-4 text-gray-500 hover:text-white" />
      </button>
    </Tooltip>
  );
};
