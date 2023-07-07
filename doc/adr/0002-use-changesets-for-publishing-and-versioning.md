# 2: Use Changesets for Publishing Packages in the Monorepo

Date: 2023-07-04

## Status

Proposed

## Context

The studio repository is a monorepo, and the current use of semantic-release for publishing packages within it is no longer suitable. The following reasons highlight the need for a change:

- **Semantic-release lacks native monorepo support**: Although there have been discussions in the semantic-release community about supporting monorepos, no progress has been made in implementing this feature. While plugins like [semantic-release-monorepo](https://github.com/pmowrer/semantic-release-monorepo) exist, they do not adequately address the management of internal packages.

- **Semantic-release enforces semantic-commits**: Without including the change type in the pull request (PR) title, semantic-release cannot effectively operate.

## Decision

To address the issues outlined above, we will adopt the use of [changesets](https://github.com/changesets/changesets) to manage package releases and publishing to GitHub. Additionally, we will introduce a separate GitHub workflow to handle the release process for different channels.

We choose [changesets](https://github.com/changesets/changesets) for the following reasons:

- **Recommended by Turborepo**: Changesets come highly recommended within the development community, particularly within the context of monorepos.

- **Ease of use**: Changesets provide a user-friendly interface for managing versioning and releases.

- **Support for monorepo and internal packages**: Changesets natively support monorepos and allow for the management of internal packages.

- **Separation of the publishing process**: Changesets allow us to decouple the process of releasing packages from the act of publishing them to platforms like docker.io and other locations.

- **Auto versioning**: Changesets versioning by itself so we can drop the workflow that is responsible for versoning packages after release.

## Consequences

As a result of this change, the following consequences should be considered:

- **Move away from Conventional Commits**: The requirement to adhere to [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for PRs will be lifted. Instead, contributors and maintainers must specify their changes using [changesets](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md).

- **Integration of changesets bot**: To ensure consistent usage of changesets, the [changesets bot](https://github.com/apps/changeset-bot) will be added to the project. This bot will verify the presence of changesets within the repository.

- **disable version bumping workflow**: we can disable the [verson bump workflow](https://github.com/asyncapi/studio/blob/master/.github/workflows/if-nodejs-version-bump.yml) since changesets handles it by itself.