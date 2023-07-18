# 3: Use a design system and UI kit

Date: 2023-07-10

## Status

Accepted

## Context

To streamline the development process of Studio, it is important to establish a design system and accompanying UI kit. The goal is to provide developers with pre-designed components and guidelines, eliminating the need to start from scratch for each interface and reducing the cognitive load of making design decisions.


## Decision

We have decided to create a UI kit and design system as code rather than solely relying on Figma files. While Figma files can be useful for initial designs and gathering feedback, providing the components and designs as code will enable developers to directly implement them in their projects.

The design system and UI kit should include components for typography, buttons, navigation, menus, modals, and other elements essential to our UI. However, it is important to avoid adding components that are not necessary for our specific use case. The aim is to establish a framework that accelerates development, not to build yet another comprehensive UI library.

To accommodate this change, we have chosen to use the [turborepo](https://turbo.build/repo) tool to transition the Studio repository into a mono repository. This will allow us to manage multiple applications within a single repository, making it easier to maintain and distribute the design system and UI kit.

## Consequences

Implementing this decision will result in the following consequences:

- The code repository will be transformed into a mono repository, accommodating multiple applications.
- Developers will have access to a design system and UI kit provided as code, enabling them to quickly incorporate standardized components into their projects.