import { create } from '@ebay/nice-modal-react';
import { NewFileModal } from './NewFileModal';
import { ConfirmModal } from './ConfirmModal';
import { show as showModal } from '@ebay/nice-modal-react';

export const ConfirmNewFileModal = create(() => {
  const onConfirm = () => {
    showModal(NewFileModal)
  };

  return (
    <ConfirmModal
      containerClassName="sm:max-w-6xl"
      title="Confirm New File"
      confirmText="Create New File"
      confirmDisabled={false}
      onSubmit={onConfirm}
    >
      <div className="flex content-center justify-center flex-col">
        <div className="w-full  overflow-auto">
          <div>
            <span className="text-gray-200">Would you like to create a new file?</span>
            <p>
              <b className='text-pink-500'>All the existing changes will be lost and overwritten.</b>
            </p>
          </div>
        </div>
      </div>
    </ConfirmModal>
  );
});
