import { createState, useState } from '@hookstate/core';

export interface SpecificationState {
  shouldOpenConvertModal: boolean;
  forceConvertToLatest: boolean;
}

export const specState = createState<SpecificationState>({
  shouldOpenConvertModal: false,
  forceConvertToLatest: false,
});

export function useSpecState() {
  return useState(specState);
}
