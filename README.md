# AsyncAPI Hub

## Customizing it

### Customizable UI areas

|Area|Type|Description|
|---|---|---|
| Topbar > Not logged in | React Component | The area on the right side of the top bar. Only when user is not signed in.
| User Menu | JSON | Add new items to the menu.
| Settings > Organization > Sidebar Menu | JSON | Add new items to the menu.
| Settings > Organization > Custom Page | Page | Where the Sidebar Menu item points to.
| Waiting List Page | Page | The waiting list page.

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
