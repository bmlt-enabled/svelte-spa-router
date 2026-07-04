---
id: route-events
title: Route events & callbacks
sidebar_position: 3
description: Bubble events with onRouteEvent and react to navigation with onRouteLoading and onRouteLoaded.
---

# Route events & callbacks

## `onRouteEvent`

The `onRouteEvent` callback prop can be used to bubble events from a component displayed by the router up to the router's parent component.

For example, assume your `App` component contains the `Router` component, and inside the router the current view is displaying the `Foo` component. If `Foo` emitted an event, `Router` would receive it and ignore it by default.

Using `onRouteEvent` instead allows components within the router (such as `Foo`) to bubble a payload up to the `Router` component's parent.

`App.svelte`:

```svelte
<script>
    import Router from '@bmlt-enabled/svelte-spa-router'
    import Foo from './Foo.svelte'

    const routes = { '*': Foo }

    function onRouteEvent(detail) {
        // Do something
    }
</script>

<Router {routes} {onRouteEvent} />
```

`Foo.svelte`:

```svelte
<script>
    let { onRouteEvent = () => {} } = $props()
</script>

<button onclick={() => onRouteEvent({ foo: 'bar' })}>Hello</button>
```

## `onRouteLoading` and `onRouteLoaded`

These two callbacks notify the application when routes are being mounted. You can optionally listen to them and trigger custom logic.

First, the router calls **`onRouteLoading`** when it's about to mount a new component. If the component is [dynamically-imported](../code-splitting.md) and needs to be requested, this callback fires when the request begins. In all other cases (already-loaded async component, or a statically-included component) `onRouteLoading` is still called right before `onRouteLoaded`.

Eventually, the router calls **`onRouteLoaded`** after a route has been successfully loaded (and injected into the DOM).

The `detail` object for `onRouteLoading`:

```js
detail = {
    // The route that was matched, as in the route definition object
    route: '/book/:id',
    // The current path (same as router.location) — the actual path the user requested
    location: '/book/343',
    // The querystring (same as router.querystring)
    querystring: 'foo=bar',
    // Params matched from the route (such as :id)
    params: { id: '343' },
    // User data passed with the wrap function
    userData: {...}
}
```

For `onRouteLoaded`, the `detail` argument contains the properties above plus two more:

```js
detail = {
    route: '/book/:id',
    location: '/book/343',
    querystring: 'foo=bar',
    params: { id: '343' },
    userData: {...},

    // The name of the Svelte component that was loaded
    name: 'Book',
    // The actual Svelte component that was loaded (a function)
    component: function() {...},
}
```

Example:

```svelte
<script>
    function onRouteLoading(detail) {
        console.log('onRouteLoading')
        console.log('Route', detail.route)
        console.log('Location', detail.location)
        console.log('Querystring', detail.querystring)
        console.log('User data', detail.userData)
    }

    function onRouteLoaded(detail) {
        console.log('onRouteLoaded')
        console.log('Route', detail.route)
        console.log('Location', detail.location)
        console.log('Querystring', detail.querystring)
        console.log('Params', detail.params)
        console.log('User data', detail.userData)
        // Unique to onRouteLoaded:
        console.log('Component', detail.component) // a Svelte component (a function)
        console.log('Name', detail.name)
    }
</script>

<Router {routes} {onRouteLoading} {onRouteLoaded} />
```

For help with the `wrap` function, see [Route wrapping](route-wrapping.md).

:::warning Minified component names
When using minifiers such as terser, the name of Svelte components might be altered. It is recommended to use custom [user data](route-wrapping.md#user-data) to identify the component, rather than relying on `detail.name`, which might contain a minified name.
:::
