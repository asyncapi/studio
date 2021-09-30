export * from './ConfirmModal';
export * from './ImportURLModal';

export interface IModalProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  confirmText?: React.ReactNode;
  confirmDisabled?: boolean;
  opener?: React.ReactNode;
  show?: boolean;
  onSubmit?: () => void;
  onCancel?: () => void;
}
