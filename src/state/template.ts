import { createState, useState } from '@hookstate/core';

export interface TemplateState {
  rerender: boolean;
}

export const templateState = createState<TemplateState>({
  rerender: false,
});

export function useTemplateState() {
  return useState(templateState);
}
