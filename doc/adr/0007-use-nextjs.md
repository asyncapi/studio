# 7: Use pnpm packagage manager

Date: 2024-04-29

## Status

Accepted

## Context

AsyncAPI Studio is currently a CRA application and runs entirely on the client.
We find the need for a more robust and scalable solution to handle UI rendering and enhance the user experience. There are several [key considerations](https://github.com/asyncapi/studio/issues/661#issuecomment-1594226439) leading to this proposal.


## Decision

Following [our discussion](https://github.com/asyncapi/studio/issues/661), we have decided to adopt Next.js as the new front-end framework for AsyncAPI Studio. Next.js offers several advantages that align with our requirements:

- **Server-Side Rendering (SSR)**: Next.js allows components to render on the server side, speeding up initial page load times in the future.
- **Automatic Code Splitting**: It automatically splits code at the component level, allowing users to load only the necessary amount of code. It will be specially useful when we have the visaul editor.


## Consequences

Adopting Next.js for AsyncAPI Studio will lead to:

- Improved Load Times and Performance.
- Intial effort for migration.
