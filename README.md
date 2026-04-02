# Studio

This is a monorepo containing Studio source code, design system, and all their dependencies.

### Installing

Clone this repo and run:

```
pnpm install
```

> **Note:** PNPM v8+ and Node.js v18.17+ is required.

## Development

#### Run Studio locally

```
pnpm run studio
```

#### Run the Design System locally

```
pnpm run ds
```

#### Run Studio and the Design System locally at the same time

```
pnpm run dev
```

#### Build Studio for production

```
pnpm run build:studio
```

#### Build Studio for Docker

```
docker build -f apps/studio/Dockerfile -t asyncapi/studio .
```
For instructions on running it please refer to this [doc](/apps/studio/README.md#using-it-via-docker).

#### Build the Design System for production

```
pnpm run build:ds
```

#### Build Studio and the Design System for production

```
pnpm run build
```

## Features

### Remote URL Import with Relative References

Studio supports importing AsyncAPI files from remote URLs with automatic resolution of relative `$ref` references:

- Import files from any URL (e.g., GitHub raw URLs, public APIs)
- The parser automatically resolves relative references using the remote URL as base path
- Example: A file at `https://example.com/specs/api.yaml` referencing `../schemas/user.json` resolves to `https://example.com/schemas/user.json`

### Local Folder Access for Reference Resolution

Studio can resolve local file references (e.g., `$ref: './schema.avsc'`) by requesting folder access:

**Workflow:**
1. Click **Import** → **Open Folder**
2. Select the root folder containing your AsyncAPI files and schemas
3. Select the main AsyncAPI file within that folder
4. The parser automatically resolves all relative file references

**Supported reference formats:**
- `./schema.avsc` - Same directory as the AsyncAPI file
- `../common/types.yaml` - Parent directory
- `apis/avro/schema.avsc` - Subdirectory path

**Supported schema formats:**
- Avro `.avsc` files
- JSON Schema `.json` files
- YAML schema `.yaml` files

**Browser compatibility:**
- ✅ Chrome, Edge, Brave (File System Access API supported)
- ❌ Firefox, Safari (not supported)

**Security note:** Folder access is granted per session only and is not persisted. You must grant access each time you open the application.

### Schema Editing

- Edit both the main AsyncAPI document and referenced schema files
- Changes to referenced schemas are automatically reflected when the parser re-validates
- Real-time validation across all files

### File Saving

- Files opened from a folder (using **Open Folder**) can be saved to their original location with the **Save** button
- For other files, the **Save** button behaves as **Save As**, allowing you to export the current editor content to a selected local file

### Additional Viewers

- **Markdown Preview**: View documentation files with full Markdown rendering, including Mermaid diagrams
- **Avro Schema Viewer**: Visualize Avro schemas with automatically generated Mermaid diagrams

## Architecture decision records

### Create a new architecture decision record

- Copy `doc/adr/0000-template.md` to a new file (e.g `doc/adr/0001-record-architecture-decisions.md`)
- Open a new PR and discuss the decision with the community
- The PR must have `kind/adr` label
- The PR Title must starts with `chore: [ADR-nnnn] name of ADR` where `nnnn` is the adr number (e.g `chore: [ADR-0001] use architecture decision records`) same us commits.

### List existing architecture decision records

See [doc/adr](doc/adr)
