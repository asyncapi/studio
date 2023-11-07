# Studio

This is a monorepo containing Studio source code, design system, and all their dependencies.

### Installing

Clone this repo and run:

```
npm install
```

> **Note:** NPM v7+ is required.

## Development

#### Run Studio locally

```
npm run studio
```

#### Run the Design System locally

```
npm run ds
```

#### Run Studio and the Design System locally at the same time

```
npm run dev
```

#### Build Studio for production

```
npm run build:studio
```

#### Build the Design System for production

```
npm run build:ds
```

#### Build Studio and the Design System for production

```
npm run build
```

## Architecture decision records

### Create a new architecture decision record

- Copy `doc/adr/0000-template.md` to a new file (e.g `doc/adr/0001-record-architecture-decisions.md`)
- Open a new PR and discuss the decision with the community
- The PR must have `kind/adr` label
- The PR Title must starts with `chore: [ADR-nnnn] name of ADR` where `nnnn` is the adr number (e.g `chore: [ADR-0001] use architecture decision records`) same us commits.

### List existing architecture decision records

See [docs/adr](docs/adr)
