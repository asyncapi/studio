---
"@asyncapi/studio": patch
---

Stop publishing `@asyncapi/studio-ui` as a runtime dependency of `@asyncapi/studio`.

`@asyncapi/studio-ui` is a private workspace package and is not published to npm. Listing it in `dependencies` caused `@asyncapi/studio@1.4.0` to require `@asyncapi/studio-ui@0.5.0` on install, which 404s and breaks consumers such as `@asyncapi/cli`. Keep the workspace link as a `devDependency` so Studio can still import it at build time without exposing it to npm consumers.
