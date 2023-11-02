# 5. Integrate Tailwind CSS into Design System for Styling

Date: 2023-10-24

## Status

Accepted

## Context

As of now, the design system doesn't provide a way to style components.
All of the styling has to be done in the `ui` package. why do we want to styling in design system?
Well, if we want to showcase how [Organisms](https://atomicdesign.bradfrost.com/chapter-2/#organisms) like Forms behave we need some basic styling support in design system as well.
The studio is already planning to use Tailwind CSS for its UI, making it a logical choice to consider Tailwind for the design system as well.

## Decision

We propose to integrate Tailwind CSS into our design system. This will allow us to use the tailwind utility classes in our design system as well, such as Forms.

## Consequences

- Tailwind utility classes will be usable in design system.
- Another tool (`concurently`) have to be used to run storybook and tailwind css side by side.
- design system will be more complex and harder to understand for newcomers.
