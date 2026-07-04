---
id: nested-routers
title: Nested routers
sidebar_position: 5
description: Compose routers by nesting a Router inside another route's component.
---

# Nested routers

The `<Router>` component of @bmlt-enabled/svelte-spa-router can be nested without issues.

For example, consider an app with these four components:

```svelte
<!-- App.svelte -->
<script>
import Router from '@bmlt-enabled/svelte-spa-router'
import Hello from './Hello.svelte'
// Routes for the "outer router"
const routes = {
    // Define both '/hello' and '/hello/*' to match with and without sub-paths
    '/hello': Hello,
    '/hello/*': Hello,
}
// Note: with a Map you could use a regex instead:
// routes.set(/^\/hello(\/(.*))?/, Hello)
</script>

<Router {routes} />
```

```svelte
<!-- Hello.svelte -->
<script>
import Router from '@bmlt-enabled/svelte-spa-router'
import FullName from './FullName.svelte'
import ShortName from './ShortName.svelte'
// Routes for the "inner router"
// Note the "prefix" property for this nested router
const prefix = '/hello'
const routes = {
    '/:first/:last': FullName,
    '/:first': ShortName,
}
</script>

<h2>Hello!</h2>
<Router {routes} {prefix} />
```

```svelte
<!-- FullName.svelte -->
<script>
let { params = {} } = $props()
</script>

<p>You gave us both a first name and last name!</p>
<p>First: {params.first}</p>
<p>Last: {params.last}</p>
```

```svelte
<!-- ShortName.svelte -->
<script>
let { params = {} } = $props()
</script>

<p>You shy person, giving us a first name only!</p>
<p>First: {params.first}</p>
```

This works as you would expect:

- `#/hello/John` shows the `ShortName` component and passes "John" as `params.first`.
- `#/hello/Jane/Doe` shows the `FullName` component, passing "Jane" as `params.first` and "Doe" as `params.last`.
- Both routes also display the `Hello!` header.

Both routes first load the `Hello` route, as they both match `/hello/*` in the outer router. The inner router then loads the separate components based on the path.

Features like highlighting [active links](../active-links.md) still work, regardless of where those links are placed in the page.

:::note Prefixes with parameters
If your parent router uses a route that contains parameters, such as `/user/:id`, then you must define a **regular expression** for `prefix`. For example: `prefix={/^\/user\/[0-9]+/}`.
:::
