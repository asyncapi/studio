import { create } from '@ebay/nice-modal-react';

import { ConfirmModal } from './ConfirmModal';

interface BrowserNotSupportedModalProps {
  isBrave?: boolean;
}

export const BrowserNotSupportedModal = create<BrowserNotSupportedModalProps>(({ isBrave = false }) => {
  return (
    <ConfirmModal
      title="File System Access API Not Supported on this Browser"
      cancelText="Close"
      containerClassName="w-full max-w-2xl sm:w-3/5"
    >
      <div className="flex flex-col space-y-4 text-sm text-gray-700">
        <p>
          The Open Folder feature requires the File System Access API, which is not available in your current browser context.
        </p>
        <div>
          <p className="font-medium text-gray-900">Browser support</p>
          <ul className="mt-2 space-y-1">
            <li>✅ Chrome</li>
            <li>✅ Edge</li>
            <li>✅ Brave (requires manual flag enablement)</li>
            <li>❌ Firefox (not supported)</li>
            <li>❌ Safari (not supported)</li>
          </ul>
        </div>
        {isBrave && (
          <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4">
            <p className="font-medium text-gray-900">You are using Brave browser. To enable this feature:</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>
                Navigate to <code className="rounded bg-white px-1 py-0.5 text-pink-600">brave://flags/#file-system-access-api</code>
              </li>
              <li>Enable the &quot;File System Access API&quot; flag</li>
              <li>Restart Brave browser</li>
              <li>Try again</li>
            </ol>
          </div>
        )}
      </div>
    </ConfirmModal>
  );
});
