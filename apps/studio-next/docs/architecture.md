# Studio Architecture Considerations

Studio is an isomorphic application built on top of the [Next.js](nextjs) framework.

## Routing

Routing is handled by the Next.js framework. Please have a look at [the documentation](https://nextjs.org/docs/app/building-your-application/routing) to better understand how it works.

As a rule of thumb, every UI state that could be worth sharing with others, deserves its own URL and therefore its own route.

## Separation of concerns

### Components

> **Warning:** We should never ever put business logic on components.

Components **must** be loosely-coupled pieces that could be easily integrated into another application without having to change anything on them. They live in the `src/components` directory.

A good way to know if your component is tightly coupled to Studio, is to put it as is in the design system. If your component is importing some Studio-specific stuff, fetching or sending data, or the like, chances are your component is thightly coupled.

#### Don't do this:

```jsx
export default function Sidebar() {
  const items = [
    { icon: ..., title: ..., onClick: ... },
    ...
  ]

  return (
    <nav>
      <ul>
        {
          items.map((item) => (
            <li onClick={item.onClick}>
              <Icon name={item.icon}>
              <span>{item.title}</title>
            </li>
          ))
        }
      </ul>
    </nav>
  )
}
```

#### Instead, do this:

```jsx
export default function Sidebar({ items }) {
  return (
    <nav>
      <ul>
        {
          items.map((item) => (
            <li onClick={item.onClick}>
              <Icon name={item.icon}>
              <span>{item.title}</title>
            </li>
          ))
        }
      </ul>
    </nav>
  )
}
```

It's a small change that makes a huge difference. In the first example, we won't be able to reuse the component to render other set of items. In the second one, it's as easy as passing a separate `items` array as a prop.

Whenever you need to add some Studio-specific business logic or data, use Containers.

### Containers

A container is a React component that handles some business logic and data. It **must** never render its own UI but instead, it **must** render existing components. They live in the `src/containers` directory.

You can use containers to logically group parts or sections of the UI.

#### Don't do this:

```jsx
export default function SidebarContainer() {
  const items = [
    { icon: ..., title: ..., onClick: ... },
    ...
  ]

  return (
    <nav>
      <ul>
        {
          items.map((item) => (
            <li onClick={item.onClick}>
              <Icon name={item.icon}>
              <span>{item.title}</title>
            </li>
          ))
        }
      </ul>
    </nav>
  )
}
```

#### Not even this, if possible:

```jsx
import Sidebar from '../components/Sidebar'

export default function SidebarContainer() {
  const items = [
    { icon: ..., title: ..., onClick: ... },
    ...
  ]

  return (
    <div>
      <Sidebar items={items}>
    </div>
  )
}
```

#### Instead, do this:

```jsx
import Sidebar from '../components/Sidebar'

export default function SidebarContainer() {
  const items = [
    { icon: ..., title: ..., onClick: ... },
    ...
  ]

  return (
    <Sidebar items={items}>
  )
}
```

In some sense, the highest container in the application would be the page container but since we're using Next.js, we should place this logic in the `page.tsx` instead of in a separate container. In any case, same rules apply. A Page container **must not** render its own UI but instead, it should render existing components.

## Build for the web

We should build Studio to work on the browser. It may sound obvious but projects like the [Monaco editor](monaco) are built with Electron desktop apps in mind, which is a bit different than a regular browser and that's why it becomes so hard to make it work there.

We should aim for the web. At the time of this writing, we're not foreseeing a desktop app for Studio. Anyhow, if that time arrives, adapting a web application to work on Electron is going to be much easier than doing it the other way around.

## No unnecessary abstractions

Watch out for complex abstractions. They can quickly make a project unmaintainable and difficult to reason about. Most of the time, it's better to repeat similar code than to build complex abstractions. [DRY](dry) is a tricky concept that many people don't understand well at first or take it to the extreme. We should aim for [AHA](aha) instead.


[nextjs]: https://nextjs.org "Next.js"
[monaco]: https://microsoft.github.io/monaco-editor/ "Monaco editor"
[dry]: https://en.wikipedia.org/wiki/Don%27t_repeat_yourself "Don't repeat yourself principle"
[aha]: https://kentcdodds.com/blog/aha-programming "AHA programming"