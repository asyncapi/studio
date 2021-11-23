import { createState, useState } from '@hookstate/core';

export interface TemplateState {
  autoRendering: boolean;
  renderingDelay: number;
}

export const templateState = createState<TemplateState>({
  autoRendering: JSON.parse(localStorage.getItem('template-auto-rendering') || true as any),
  renderingDelay: JSON.parse(localStorage.getItem('template-rendering-delay') || 0 as any) || 625,
});

export function useTemplateState() {
  return useState(templateState);
}
