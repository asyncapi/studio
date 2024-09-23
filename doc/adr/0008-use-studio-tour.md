# ADR 8: Implement Interactive User Onboarding Tour
Date: 2024-07-20

## Status
Proposed

## Context
The Studio currently lacks a structured onboarding process for new users, particularly those transitioning from Playground. This gap can lead to a steep learning curve and potentially lower user engagement. Key issues include:

1. New users may struggle to understand the Studio's advanced features and capabilities.
2. The transition from Playground to Studio may not be intuitive for all users.
3. There's no guided introduction to the Studio's interface and workflow.

## Decision
We propose to implement an interactive user onboarding tour using Driver.js. This decision is based on a comparison with other libraries, including react-joyride. The key factors influencing this decision are:

1. Driver.js is built entirely on vanilla Typescript, has zero dependencies, and is very fast. It's only ~5kb gzipped, significantly smaller than alternatives which are 12kb+.

2. Driver.js is the most starred repository for tour libraries on GitHub, with over 23k+ stars, indicating strong community support and regular maintenance.

3. Driver.js is highly customizable and provides hooks for element manipulation during the tour.

4. It offers a straightforward popover tour functionality that aligns well with our need for a simple, 10 step onboarding process.

5. Due to its lack of dependencies, Driver.js offers better performance compared to heavier libraries like react-joyride.


Trade-offs:

- Driver.js does not provide built-in interactivity during the tour. Users cannot interact with elements while the tour is in progress, unlike react-joyride.
- To mitigate this limitation, we'll design the tour with clear and consise content for each step of the tour.
- We believe the performance benefits and cleaner user experience outweigh this limitation for our specific use case.

The onboarding tour will include:
- A popover-based introduction with 10 simple steps.
- Highlights of key areas such as the Control Center, Information Panel, Editor, Share and Editor Options, Terminal, HTML Preview, Studio Settings, and Community Engagement features.
- Clear, concise instructions for new users transitioning from Playground.

## Consequences

Positive:
- Implementing an interactive user onboarding tour using Driver.js will significantly improve the new user experience by providing a structured introduction to the Studio's features.
- This will reduce the learning curve, increase user engagement, and help users navigate the Studio more effectively.
- The tour will highlight key areas and functionalities, ensuring users can quickly grasp the tool's capabilities and start using it productively.

Potential Challenges:
- We'll need to invest time in creating clear, concise content for each step of the tour.
- Regular updates may be necessary to keep the tour aligned with any interface changes.
