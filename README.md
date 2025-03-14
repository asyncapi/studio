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

## Architecture decision records

### Create a new architecture decision record

- Copy `doc/adr/0000-template.md` to a new file (e.g `doc/adr/0001-record-architecture-decisions.md`)
- Open a new PR and discuss the decision with the community
- The PR must have `kind/adr` label
- The PR Title must starts with `chore: [ADR-nnnn] name of ADR` where `nnnn` is the adr number (e.g `chore: [ADR-0001] use architecture decision records`) same us commits.

### List existing architecture decision records

See [docs/adr](docs/adr)
