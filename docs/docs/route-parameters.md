---
id: route-parameters
title: Route parameters
sidebar_position: 5
description: Read named and wildcard parameters from routes, plus the current location.
---

# Route parameters

## Parameters from routes

@bmlt-enabled/svelte-spa-router uses a vendored copy of [regexparam](https://github.com/lukeed/regexparam) to parse routes, so you can add parameters to a route. The basic syntax is:

- `/path` matches `/path` exactly (and only that)
- `/path/:id` matches `/path/` followed by any string, which becomes a named argument `id`
- `/path/:id/:version?` allows an optional second named argument `version`
- `/path/*` matches `/path/` followed by anything, using a non-named argument

If your route contains any parameter, they are made available to your component inside the `params` prop.

For example, for a route `/name/:first/:last?`, you can create this Svelte component:

```svelte
<script>
    // You need to define the component prop "params"
    let { params = {} } = $props()
</script>

<p>
    Your name is: <b>{params.first}</b>
    {#if params.last}<b>{params.last}</b>{/if}
</p>
```

Non-named arguments are returned as `params.wild`.

:::tip
For routes that need more power than named parameters, see [Regular expression routes](regular-expression-routes.md).
:::

## Getting the current page

You can get the current page from `router.location`:

```svelte
<script>
    import { router } from '@bmlt-enabled/svelte-spa-router'
</script>

<p>The current page is: {router.location}</p>
```

If you need both the location and the querystring together, use `router.loc`.

The `router` object also exposes `router.querystring` (see [Querystring](querystring.md)) and `router.params`.
