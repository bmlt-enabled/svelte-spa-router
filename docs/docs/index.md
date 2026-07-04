---
id: index
title: Introduction
slug: /
sidebar_label: Introduction
sidebar_position: 1
description: A router for Svelte 5 Single Page Applications — hash-based by default, or clean History API paths.
---

# @bmlt-enabled/svelte-spa-router

**@bmlt-enabled/svelte-spa-router** is a router for [Svelte 5](https://svelte.dev) applications, specifically optimized for Single Page Applications (SPA).

It is maintained by [BMLT Enabled](https://bmlt.app) and is a fork of [ItalyPaleAle/svelte-spa-router](https://github.com/ItalyPaleAle/svelte-spa-router), updated for Svelte 5 with added support for clean, path-based URLs.

## Highlights

- Supports both **hash-based routing** (default) and **History API path-based routing** for clean URLs — [switch with a single prop](routing-modes.md).
- **Base-path aware** — serve your app from a sub-path like `example.com/meetings/` with a single `basePath` setting.
- **Insanely simple** to use, with a minimal footprint.
- Uses a vendored copy of the tiny [regexparam](https://github.com/lukeed/regexparam) for parsing routes, with support for parameters (e.g. `/book/:id?`) and more.
- **Same API in both modes** — `push`, `pop`, `replace`, `use:link`, `use:active`, and route definitions all work identically whether you use hashes or clean paths.

This module is released under the MIT license.

:::note Svelte 5 required
This package requires **Svelte 5 or later**. For Svelte 3 and 4, use the original [upstream project](https://github.com/ItalyPaleAle/svelte-spa-router). See the [Upgrading guide](upgrading.md) for migration notes.
:::

## A 30-second taste

```js
import Router from '@bmlt-enabled/svelte-spa-router'
import Home from './routes/Home.svelte'
import Book from './routes/Book.svelte'
import NotFound from './routes/NotFound.svelte'

const routes = {
    '/': Home,
    '/book/:id': Book,
    '*': NotFound,
}
```

```svelte
<!-- Hash-based routing (default) -->
<Router {routes} />

<!-- …or clean URLs using the History API -->
<Router {routes} hashMode={false} />
```

That's the whole setup. Head to [Getting started](getting-started.md) to add it to your project.

## Hash-based vs. path-based routing

With **hash-based routing** (the default), navigation is stored in the part of the URL after `#` (the "hash" or "fragment"), e.g. `http://example.com/#/profile`. It's simple, works without any server configuration, and is great for static SPAs — many popular apps use it, including GMail.

With **path-based routing** (History API), URLs are clean, e.g. `http://example.com/profile`. This looks nicer but requires your server to serve `index.html` for all routes.

Both modes share the exact same API. Read [Routing modes](routing-modes.md) to decide which fits your app.

## Where to next

- [Getting started](getting-started.md) — install and define your first routes
- [Routing modes](routing-modes.md) — hash vs. path, and how to switch
- [Navigation](navigation.md) — links and programmatic navigation
- [Advanced usage](advanced/index.md) — wrapping, guards, transitions, nested routers, and more
- [Upgrading](upgrading.md) — breaking changes between major versions
