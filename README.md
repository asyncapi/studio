# AsyncAPI Studio

# :warning: THIS REPO IS STILL IN EARLY DEVELOPMENT. WE'RE DOCUMENTING IT NOW AND WE'LL BE SOON READY TO USE.

## Customizing it

### Customizable UI areas

|Area|Type|Description|Status|
|---|---|---|
| Settings > Organization > Sidebar Menu | JSON | Add new items to the menu.
| Settings > Organization > Custom Page | Page | Where the Sidebar Menu item points to.

### Customizable server areas

|Area|Description|
|---|---|
| Pages | Register new pages.
| Routes | Register routes in the server.
| Middlewares | Register middlewares in the server.
| Events | Subscribe to server events and react accordingly.
| Hooks | Subscribe to hooks and modify behavior.

#### Server hooks

|Hook|Description|
|---|---|
| `auth:github` | Triggered when user signs in using Github.
