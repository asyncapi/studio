# AsyncAPI Studio

> :warning: This repo is still in the early stages. We'll work on its documentation as soon as possible.

## Requirements

* Docker
* Docker Compose
* Node.js 14+

## Using it locally

If it's your first time, run:

```
npm install
npm run dev:prepare
docker-compose up -d session db
```

Then run the following command to start Studio:

```
npm run dev
```

## Customizing it

### Customizable UI areas

|Area|Type|Description|
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
