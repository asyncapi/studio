# 6: Use pnpm packagage manager

Date: 2024-04-03

## Status

Accepted

## Context

We have been using npm as our package manager for the development of studio. However, we've found that the npm package manager is quite limiting in some aspects.

1) disk usage by node_modules directory is quite high as npm creates a separate node_modules for every project.

2) The significant amount of time npm takes to install all of the dependencies. In some cases, it takes up to 5 minutes for all dependencies to be installed in studio, which interrupts the developers' workflow and slows down the development process.


## Decision

We have decided to use pnpm instead of npm as our package manager in studio. The pnpm saves disk space by reusing packages stored in a global storage. If multiple projects use the same version of a package, pnpm will only keep one physical copy of the package on the disk. As a result, it can save significant storage space, making it a better choice for us.

Additionally, it's safer than npm. It uses symlinks to link packages in the global store into node_modules instead of copying files from one place to another. This ensures there's a single flat copy of the project's dependency tree, making the structure more reliable and predictable. Also, pnpm is generally faster than npm when it comes to installing packages.

## Consequences

Implementing this decision will result in the following consequences:

- **Significant disk space savings**: Since pnpm does not copy packages to node_modules of every project, it typically uses less disk space than npm.
- **Faster package installation**: pnpm is generally faster than npm when it comes to installing packages, which will help reduce downtime in the development process.
- **Change**: Contributors will need to familiarize themselves with pnpm and how it differs from npm. However, its commands and overall usage are very similar to npm, so the learning curve should not be steep.
- **Migration**: We will need to migrate studio from npm to pnpm.
