---
"@asyncapi/studio": minor
---

Add local-folder editing with relative reference resolution and direct file saving.

- Added support for opening and editing local folders via the File System Access API.
- Added automatic resolution of relative references (for example `$ref`, `./`, and `../`) inside opened folders.
- Added direct writes to local files, with format inference on Save and Save As based on file extension.
- Added preview support for OpenAPI (RapiDoc), Markdown (including Mermaid), and Avro schemas, alongside existing AsyncAPI preview.
- Changed save/export behavior: Save writes to the current local file when available, while Save As prompts for a destination and infers output format from the extension.
- Removed auto-save and draft restoration via `localStorage`, and removed separate YAML/JSON export actions.

Notes:
- Local-folder access currently requires File System Access API support (Chromium-based browsers such as Chrome, Edge, and Brave).
- Firefox and Safari do not currently support this local-folder workflow.
- Folder access is permission-based per session and must be re-authorized on each visit.