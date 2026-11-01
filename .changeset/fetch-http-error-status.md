---
"@asyncapi/studio": patch
---

Show a clear "Failed to fetch <url>: <status>" error instead of loading an HTML error page into the editor when a document imported from a URL, a `?url=` parameter, a remote `$ref` or a shared document returns an HTTP error status.
