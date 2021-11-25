import { createState, useState } from '@hookstate/core';

export interface TemplateState {
  rerender: boolean;
  autoRendering: boolean;
}

export const templateState = createState<TemplateState>({
  rerender: false,
  autoRendering: JSON.parse(localStorage.getItem('template-auto-rendering') || true as any),
});

export function useTemplateState() {
  return useState(templateState);
}
