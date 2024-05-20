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
        const base64 = await editorSvc.exportAsBase64();
        const url = `${window.location.origin}/?base64=${encodeURIComponent(
          base64
        )}`;
        await navigator.clipboard.writeText(url);
      }()),
      {
        loading: 'Copying URL to clipboard...',
        success: 'URL copied to clipboard!',
        error: 'Failed to copy URL to clipboard.',
      }
    );
  };

  return (
    <Tooltip content={'Share link'} placement="top" hideOnClick={true}>
      <button className="bg-inherit" onClick={handleShare}>
        <FaShareAlt className="text-gray-500 hover:text-white" />
      </button>
    </Tooltip>
  );
};
