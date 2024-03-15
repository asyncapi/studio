// updateUrl.ts
// import { parseAsyncAPI } from 'parserDoc';

export function updateUrl(urlWithQueryParam: string) {
    window.history.replaceState({}, '', urlWithQueryParam);
  }
  