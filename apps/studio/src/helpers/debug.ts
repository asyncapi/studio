const DEBUG_ENABLED = false;

export function debugLog(scope: string, ...args: unknown[]) {
  if (!DEBUG_ENABLED) {
    return;
  }

  console.log(`[DEBUG:${scope}]`, ...args);
}

export function debugError(scope: string, ...args: unknown[]) {
  if (!DEBUG_ENABLED) {
    return;
  }

  console.error(`[DEBUG:${scope}]`, ...args);
}
