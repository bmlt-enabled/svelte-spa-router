---
id: code-splitting
title: Code splitting
sidebar_position: 9
description: Dynamically import route components to reduce your bundle size.
---

# Code splitting

@bmlt-enabled/svelte-spa-router supports dynamically-imported components (via the `import()` construct). The advantage of using dynamic imports is that your bundler can enable **code-splitting** and reduce the size of the bundle sent to your users. This has been tested with bundlers including Vite, Rollup, and Webpack.

To use dynamically-imported components, you leverage the `wrap` method (which can be used for a variety of features — see [Route wrapping](advanced/route-wrapping.md)). First, import the `wrap` method:

```js
import { wrap } from '@bmlt-enabled/svelte-spa-router/wrap'
```

Then, in your route definition, wrap your routes using `wrap`, passing a function that returns the dynamically-imported component to the `asyncComponent` property:

```js
wrap({
    asyncComponent: () => import('./Foo.svelte'),
})
```

:::warning Pass a function, not an invocation
The value of `asyncComponent` must be the **definition of a function** returning a dynamically-imported component, such as `asyncComponent: () => import('./Foo.svelte')`.

Do **not** use `asyncComponent: import('./Foo.svelte')`, which is a function invocation — this would request the module right away rather than on-demand.
:::

For example, to make the Author and Book routes dynamically-imported:

```js
// Import the wrap method
import { wrap } from '@bmlt-enabled/svelte-spa-router/wrap'

// Note that Author and Book are not imported here anymore, so they can be
// imported at runtime
import Home from './routes/Home.svelte'
import NotFound from './routes/NotFound.svelte'

const routes = {
    '/': Home,

    // Wrapping the Author component
    '/author/:first/:last?': wrap({
        asyncComponent: () => import('./routes/Author.svelte'),
    }),

    // Wrapping the Book component
    '/book/*': wrap({
        asyncComponent: () => import('./routes/Book.svelte'),
    }),

    // Catch-all route last
    '*': NotFound,
}
```

The `wrap` method enables other features too, including a "loading" placeholder component, route pre-conditions (guards), static props, and custom user data. Learn more in [Route wrapping](advanced/route-wrapping.md).
