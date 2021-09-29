import { createState, useState } from '@hookstate/core';

export interface SpecificationState {
  shouldOpenConvertModal: boolean;
}

export const specState = createState<SpecificationState>({
  shouldOpenConvertModal: false,
});

export function useSpecState() {
  return useState(specState);
}
