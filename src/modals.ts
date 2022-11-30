import { register } from '@ebay/nice-modal-react';

import {
  GeneratorModal,
  SettingsModal,
  ConvertModal,
  ConvertToLatestModal,
  ImportBase64Modal,
  ImportURLModal,
  NewFileModal,
  RedirectedModal,
} from './components/Modals';

import type { ComponentType, FunctionComponent } from 'react';

type Modal = {
  id: string;
  modal: ComponentType<any>;
}

const modals: Modal[] = [
  {
    id: 'generator-modal',
    modal: GeneratorModal,
  },
  {
    id: 'settings-modal',
    modal: SettingsModal,
  },
  {
    id: 'convert-modal',
    modal: ConvertModal,
  },
  {
    id: 'convert-to-latest-modal',
    modal: ConvertToLatestModal,
  },
  {
    id: 'convert-base64-modal',
    modal: ImportBase64Modal,
  },
  {
    id: 'convert-url-modal',
    modal: ImportURLModal,
  },
  {
    id: 'new-file-modal',
    modal: NewFileModal,
  },
  {
    id: 'redirected-modal',
    modal: RedirectedModal,
  }
];

export function registerModals() {
  modals.forEach(modal => register(modal.id, modal.modal as FunctionComponent));
}
