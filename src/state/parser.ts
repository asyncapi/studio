import { AsyncAPIDocument } from '@asyncapi/parser';
import { createState, useState } from '@hookstate/core';

export interface ParserState {
  parsedSpec: AsyncAPIDocument | null;
  valid: boolean;
  errors: any[];
}

export const parserState = createState<ParserState>({
  parsedSpec: null,
  valid: false,
  errors: [],
});

export function useParserState() {
  return useState(parserState);
}
