---
id: route-wrapping
title: Route wrapping
sidebar_position: 2
description: Use wrap() for async components, loading placeholders, route guards, user data, and static props.
---

# Route wrapping

As shown in the intro documentation, the `wrap` method allows defining components that need to be dynamically-imported at runtime, which makes [code-splitting](../code-splitting.md) possible.

The `wrap` method allows a few more interesting features, however:

- In addition to dynamically-importing components, you can define a component to be shown while a dynamically-imported one is being requested.
- You can add pre-conditions to routes (sometimes called "route guards").
- You can add custom user data that is passed to the [`onRouteLoading` and `onRouteLoaded` callbacks](route-events.md).
- You can set static props, which are passed to the component when the router mounts it.

## The `wrap` method

The `wrap(options)` method is imported from `@bmlt-enabled/svelte-spa-router/wrap`:

```js
import { wrap } from '@bmlt-enabled/svelte-spa-router/wrap'
```

It accepts a single `options` argument that is an object with the following properties:

- **`options.component`** — Svelte component to use, statically-included in the bundle (e.g. `component: Foo`, with `import Foo from './Foo.svelte'`).
- **`options.asyncComponent`** — Used to dynamically-import components. This must be a function definition that returns a dynamically-imported component, such as `asyncComponent: () => import('./Foo.svelte')`.
- **`options.loadingComponent`** — Used together with `asyncComponent`; a Svelte component (part of the bundle) displayed while `asyncComponent` is being downloaded. If empty, nothing is displayed while the request is in progress.
- **`options.loadingParams`** — When using a `loadingComponent`, an optional dictionary passed to it as the `params` prop.
- **`options.userData`** — Optional dictionary passed to callbacks such as `onRouteLoading`, `onRouteLoaded`, and `onConditionsFailed`.
- **`options.conditions`** — Optional array of route pre-condition functions, executed in order.
- **`options.props`** — Optional dictionary of props passed to the component when mounted. The props are expanded with the spread operator (`{...props}`).

One and only one of `options.component` or `options.asyncComponent` must be set; all other properties are optional.

You use the `wrap` method in your route definition:

```js
import Books from './Books.svelte'

// Using a dictionary to define the route object
const routes = {
    '/books': wrap({
        component: Books,
        userData: { foo: 'bar' },
    }),
}

// Using a Map
const routes = new Map()
routes.set(
    '/books',
    wrap({
        component: Books,
        userData: { foo: 'bar' },
    }),
)
```

## Async routes and loading placeholders

The `wrap` method supports dynamically-imported components, enabling code-splitting so that code for less-common routes is downloaded on-demand rather than shipped in the app's core bundle.

This is done by setting `options.asyncComponent` to a function that returns a dynamically-imported module:

```js
const routes = {
    '/book/:id': wrap({
        asyncComponent: () => import('./Book.svelte'),
    }),
}
```

:::warning
The value of `asyncComponent` must be a function definition, such as `() => import(…)`, and **not** `import(…)` (a function invocation). The latter would request the module right away rather than on-demand.
:::

By default, while a module is being downloaded, the router does not display any component. You can define a component (statically-included in the bundle) to be shown while downloading, with `options.loadingComponent`. Additionally, `options.loadingParams` defines an object passed to the loading placeholder as the `params` prop.

For example, with a `Loading.svelte` component:

```svelte
<script>
    let { params = null } = $props()
</script>

<h2>Loading</h2>
{#if params && params.message}
    <p id="loadingmessage">Message is {params.message}</p>
{/if}
```

You can define the route as:

```js
import { wrap } from '@bmlt-enabled/svelte-spa-router/wrap'
import Loading from './Loading.svelte'

const routes = {
    '/book/*': wrap({
        // Dynamically import the Book component
        asyncComponent: () => import('./Book.svelte'),
        // Display the Loading component while the request is pending
        loadingComponent: Loading,
        // Value for `params` in the Loading component
        loadingParams: {
            message: 'secret',
            foo: 'bar',
        },
    }),
}
```

## User data

The `wrap` method can add a dictionary of custom user data, passed to all pre-condition functions and to the [`onRouteLoading`, `onRouteLoaded`, and `onConditionsFailed`](route-events.md) callbacks.

This is useful to pass custom callbacks that the handlers can use to take specific actions:

```js
import Books from './Books.svelte'

const routes = {
    // Statically-included component with user data
    '/books': wrap({
        component: Books,
        userData: { foo: 'bar' },
    }),
    // Same, but for dynamically-loaded components
    '/authors': wrap({
        asyncComponent: () => import('./Authors.svelte'),
        userData: { hello: 'world' },
    }),
}
```

## Route pre-conditions

You can define pre-conditions on routes, also known as "route guards". These are one or more functions the router executes **before** loading the component that matches the current path. Use them to implement custom checks, for example ensuring that users are authenticated.

Pre-conditions are defined in `options.conditions`, an array of callbacks. Each pre-condition function receives a `detail` dictionary with the same structure as [`onRouteLoading`](route-events.md):

- **`detail.route`** — the route that was matched, exactly as defined in the route definition
- **`detail.location`** — the current path (same as `router.location`)
- **`detail.querystring`** — the current querystring (same as `router.querystring`)
- **`detail.userData`** — custom user data passed with `wrap`

Each pre-condition must return a boolean indicating whether the condition succeeded (`true`) or failed (`false`). They're executed in order; if all succeed, the route is loaded. If one fails, the router stops and does not load any route.

```svelte
<script>
    import Router from '@bmlt-enabled/svelte-spa-router'
    import { wrap } from '@bmlt-enabled/svelte-spa-router/wrap'

    import Lucky from './Lucky.svelte'

    const routes = {
        '/lucky': wrap({
            component: Lucky,

            // Custom data: any JavaScript object (optional)
            userData: {
                hello: 'world',
                myFunc: () => {
                    console.log('do something!')
                },
            },

            // List of route pre-conditions
            conditions: [
                // Succeeds only 50% of the time
                (detail) => {
                    return Math.random() > 0.5
                },
                // Executed only if the first one succeeded
                (detail) => {
                    console.log('Pre-condition 2 executed', detail.location, detail.querystring)
                    return true
                },
            ],
        }),
    }
</script>

<Router {routes} />
```

Pre-conditions can be applied to dynamically-loaded routes too, and can be **asynchronous** functions. This is helpful, for example, to request authentication data or user profiles:

```js
const routes = {
    '/admin': wrap({
        asyncComponent: () => import('./Admin.svelte'),
        conditions: [
            async (detail) => {
                const response = await fetch('/user/profile')
                const data = await response.json()
                return data.isAdmin === true
            },
        ],
    }),
}
```

When a condition fails, the router calls the `onConditionsFailed` callback prop with the same `detail` dictionary:

```svelte
<script>
    import { replace } from '@bmlt-enabled/svelte-spa-router'

    function onConditionsFailed(detail) {
        console.error('onConditionsFailed', detail)
        if (detail.userData.foo == 'bar') {
            replace('/hello/world')
        }
    }

    function onRouteLoaded(detail) {
        console.log('onRouteLoaded', detail)
    }
</script>

<Router {routes} {onConditionsFailed} {onRouteLoaded} />
```

## Static props

In certain cases, you might need to pass static props to a component within the router.

For example, assume this component `Foo.svelte`:

```svelte
<script>
    let { num } = $props()
</script>

<p>The secret number is {num}</p>
```

You can pass props to it through the router using `wrap`:

```svelte
<script>
    import Router from '@bmlt-enabled/svelte-spa-router'
    import { wrap } from '@bmlt-enabled/svelte-spa-router/wrap'
    import Foo from './Foo.svelte'

    const routes = {
        '/': wrap({
            component: Foo,
            // Static props
            props: {
                num: 42,
            },
        }),
    }
</script>

<Router {routes} />
```
