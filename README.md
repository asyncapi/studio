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

- Install [adr tools](https://github.com/adr/adr-tools/blob/patch-1/INSTALL.md)
- `adr new Start using a React framework`
- Open a new PR and discuss the decision with the community

### List existing architecture decision records

See [docs/adr](docs/adr)
