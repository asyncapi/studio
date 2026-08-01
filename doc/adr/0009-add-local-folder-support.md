# 9: Redesign Save Behavior and Remove Implicit localStorage Persistence

**Date:** 2026-04-02

## Status

Accepted

## Context

AsyncAPI Studio now supports a multi-source, multi-file workflow, including:

- Remote documents (URLs)
- Shared/base64 content
- Local files and folders via the File System Access API

When working with local folders, Studio can resolve relative references (e.g., `$ref: './schema.avsc'`) across multiple files within the selected directory. This enables realistic project structures with distributed schemas (Avro, JSON Schema, YAML).

In addition, Studio includes multi-format preview capabilities for AsyncAPI, OpenAPI, Markdown, and Avro.

The existing `localStorage` auto-save model is incompatible with this architecture:

- **Ambiguous source of truth**: the editor may show content that does not match the underlying file, URL, or folder source
- **Silent draft restoration**: reload can override the actual source with stale local data
- **Misleading save semantics**: Save may persist only to browser storage instead of writing to disk
- **Multi-file inconsistency**: browser storage does not map cleanly to folder-based workflows
- **Reference-resolution risks**: stale drafts can break or mask correct resolution of referenced files

These issues reduce reliability and user trust, especially when working with real file systems and reference-based specifications.

## Decision

### 1) Remove implicit localStorage persistence

- Remove auto-save behavior.
- Do not restore drafts automatically on reload.
- Do not treat browser storage as a source of truth.

### 2) Introduce unified save behavior

A single save flow with contextual behavior:

- **Save**

  - Writes directly to the existing local file when operating within a user-selected folder.

- **Save As**

  - Prompts the user to choose a destination.
  - Infers format from the file extension.
  - Replaces dedicated export options.

### 3) Align with local-folder workflows

- Saving reflects actual file-system changes when folder access is granted.
- Reference resolution relies on the real file structure, not cached content.
- No hidden persistence layer should override or interfere with file-based workflows.

### 4) Defer crash recovery

Crash recovery via browser storage is not part of this decision. If reintroduced, it must:

- Be explicit and user-driven.
- Operate per file.
- Provide a clear recovery flow:

  - Load source first.
  - Detect draft differences.
  - Prompt the user to choose between source and draft.
- Clearly indicate when a draft is active.

## Consequences

### Positive

- Establishes a clear and reliable source of truth.
- Aligns save behavior with expectations from local development environments.
- Enables consistent multi-file, reference-based workflows.
- Improves reliability of relative-reference resolution.
- Prevents stale data from masking real content.

### Trade-offs

- Loss of automatic crash recovery in the short term.
- Potential loss of unsaved changes on reload.
- Increased reliance on explicit user save actions.

### Limitations

- Local-folder access depends on the File System Access API.
- Browser support:

  - Supported: Chrome, Edge, Brave
  - Not supported: Firefox, Safari
- Folder access is session-based and must be re-granted on each application load.
- In unsupported environments, saving falls back to Save As (download-based).

## Future Considerations

- Introduce an explicit draft-recovery mechanism with clear UX.
- Improve user feedback around save state and file-system permissions.
- Continue expanding and refining multi-format preview capabilities.
