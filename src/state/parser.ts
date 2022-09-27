import { createState, useState } from '@hookstate/core';

import type { OldAsyncAPIDocument as AsyncAPIDocument, Diagnostic } from '@asyncapi/parser/esm';

export interface ParserState {
  parsedSpec: AsyncAPIDocument | null;
  valid: boolean;
  diagnostics: Diagnostic[];
  hasErrorDiagnostics: boolean;
}

export const parserState = createState<ParserState>({
  parsedSpec: null,
  valid: false,
  diagnostics: [],
  hasErrorDiagnostics: false,
});

export function useParserState() {
  return useState(parserState);
}
