# 1. Record architecture decisions

Date: 2023-06-27

## Status

Accepted

## Context

We need to record the architectural decisions made on this project.


The need to record ADR (Architectural Decision Records) arises from the following reasons:

- **Centralized documentation**: ADR provides a centralized place to document architectural decisions made during studio development process. It allows capturing the "what" and "why" of each decision, ensuring that the rationale behind those decisions is well-documented.

- **Knowledge sharing and understanding**: By maintaining a record of architectural decisions, ADR enables others to understand why certain choices were made in the past. This knowledge sharing promotes transparency and helps new individual contributors grasp the reasoning behind studio architecture.

- **Evaluation and consideration**: ADR encourages the evaluation and proper consideration of architectural options before adopting them. It discourages hasty decisions based solely on the latest technologies or trends, ensuring that choices are made after careful analysis and evaluation.

- **Discussion and collaboration**: ADR facilitates discussions and collaboration among AsyncAPI community members by utilizing pull requests and GitHub comments. This allows for constructive debates, feedback, and consensus building before adopting or modifying architectural decisions.

- **Change management**: ADR acknowledges that the lifecycle of decisions can change over time. By maintaining decisions as Markdown files in a specific folder (e.g `doc/adr`) within the repository, it becomes easier to track and manage changes, ensuring that decisions are revisited, updated, or replaced when necessary.


## Decision

We will use Architecture Decision Records, as [described by Michael Nygard](http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions).

## Consequences

See Michael Nygard's article, linked above. For a lightweight ADR toolset, see Nat Pryce's [adr-tools](https://github.com/npryce/adr-tools).
