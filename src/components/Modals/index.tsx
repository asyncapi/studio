export * from './BaseModal';
export * from './ConverterModal';
export * from './ConvertToLatestModal';
export * from './ExportToLinkModal';
export * from './ImportURLModal';
export * from './ImportBase64Modal';
export * from './LoadingModal';
export * from './SettingsModal';
export * from './ShareBase64Modal';

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
