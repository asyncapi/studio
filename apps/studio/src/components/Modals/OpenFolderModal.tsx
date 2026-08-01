import toast from 'react-hot-toast';
import { create } from '@ebay/nice-modal-react';

import { ConfirmModal } from './ConfirmModal';

import { debugError, debugLog } from '@/helpers/debug';
import { useServices } from '../../services';

export const OpenFolderModal = create(() => {
  const { editorSvc } = useServices();

  const onSubmit = async () => {
    const toastId = 'open-folder';
    debugLog('ui', 'Open Folder Continue clicked');
    toast.loading('Granting folder access...', { id: toastId });
    try {
      const granted = await editorSvc.grantFolderAccess();
      if (granted) {
        toast.success('Folder access granted! File references will now be resolved.', { id: toastId });
      } else {
        toast.dismiss(toastId);
      }
    } catch (err: unknown) {
      debugError('ui', 'Open Folder failed', err);
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`Failed to grant folder access: ${message}`, { id: toastId });
    }
  };

  return (
    <ConfirmModal
      title="Open Folder"
      confirmText="Continue"
      confirmDisabled={false}
      onSubmit={onSubmit}
    >
      <div className="flex flex-col space-y-4 text-sm text-gray-700">
        <p>
          This will allow Studio to resolve local <code className="bg-gray-100 px-1 py-0.5 rounded text-pink-600">$ref</code> references
          (e.g., Avro schemas, JSON schemas) relative to your project folder.
        </p>
        <p className="font-medium">You will be prompted in two steps:</p>
        <ol className="list-decimal list-inside space-y-2 pl-2">
          <li>
            Select the <strong>root folder</strong> containing your AsyncAPI project files
          </li>
          <li>
            Select the <strong>AsyncAPI file</strong> (<code className="bg-gray-100 px-1 py-0.5 rounded">.yaml</code>,{' '}
            <code className="bg-gray-100 px-1 py-0.5 rounded">.yml</code>, or{' '}
            <code className="bg-gray-100 px-1 py-0.5 rounded">.json</code>) within that folder
          </li>
        </ol>
      </div>
    </ConfirmModal>
  );
});
