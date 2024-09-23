import React from 'react';
import { FaShareAlt } from 'react-icons/fa';
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
      <button className="bg-inherit" onClick={handleShare} data-test="button-share">
        <FaShareAlt className="text-gray-500 hover:text-white" />
      </button>
    </Tooltip>
  );
};
