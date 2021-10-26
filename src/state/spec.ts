import { createState, useState } from '@hookstate/core';

export interface SpecificationState {
  shouldOpenConvertModal: boolean;
  forceConvert: boolean;
  convertOnlyToLatest: boolean;
}

export const specState = createState<SpecificationState>({
  shouldOpenConvertModal: false,
  forceConvert: false,
  convertOnlyToLatest: false,
});

export function useSpecState() {
  return useState(specState);
}
