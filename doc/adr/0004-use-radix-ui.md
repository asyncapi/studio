# 1. Record architecture decisions

Date: 2023-07-17

## Status

Accepted


## Context

In our project, we have identified the need for a set of UI components that only handle the logical part without imposing any design aspects. We have evaluated existing libraries such as Radix and Headless UI, which provide components without implicit designs. 

We have concluded that using a ready-made library would restrict our freedom to customize the look and feel of the components. Additionally, this kind of libraries integrate design elements into their components, making it challenging or impossible to modify them according to our specific requirements.

This is related to [ADR-003](./0003-use-design-system.md).

## Decision

After careful evaluation, we have decided to use Radix UI. This decision was driven by the following factors:

- **Flexibility**: By creating our own components, we gain complete freedom to define the design and visual aspects according to our specific needs and branding.

- **Logic Integration**: Building our own components allows us to integrate both the logical and design aspects seamlessly. We can ensure that our components handle keyboard navigation, support screen readers, check for rendering space, and avoid collisions with window limits.

- **Maintenance and Community Support**: We have selected Radix as our preferred library due to its completeness, active maintenance, and vibrant community.

## Consequences

The decision to build our own UI components instead of using existing libraries will have the following consequences:

- **Increased Development Effort and maintenance**: Developing custom UI components requires additional time and effort compared to adopting an existing library.

- **Design Consistency Responsibility**: With the freedom to define our own components, we also bear the responsibility of maintaining design consistency across the application. We must establish design guidelines and ensure that all components adhere to them, promoting a cohesive and intuitive user interface.

- **Reduced Dependency on External Libraries**: By building our own components, we reduce our reliance on external libraries and minimize the risk of being tied to their specific look and feel. This independence allows us to evolve and iterate on the components based on our unique requirements, providing long-term flexibility.

By carefully considering these consequences and actively managing the development and maintenance process, we believe that building our own UI components will provide us with the flexibility, control, and customization required to deliver an outstanding studio user experience.