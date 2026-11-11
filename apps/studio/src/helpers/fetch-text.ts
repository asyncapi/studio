/**
 * Fetches a remote resource as text.
 *
 * `fetch` only rejects on network failures and resolves normally for HTTP error
 * statuses such as 404 or 500. Reading `res.text()` in that case loads the
 * server's HTML error page as if it were a document, which then surfaces as a
 * confusing YAML/JSON parser error. This helper fails early with a readable
 * message instead.
 */
export async function fetchText(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`.trim());
  }
  return response.text();
}
