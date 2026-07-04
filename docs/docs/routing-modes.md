---
id: routing-modes
title: Routing modes
sidebar_position: 3
description: Choose between hash-based routing and clean History API paths — and switch with a single prop.
---

# Routing modes

@bmlt-enabled/svelte-spa-router supports two routing modes. This flexibility is one of the main additions this fork brings over the original upstream project.

## Hash-based routing (default)

With hash-based routing, navigation is stored in the part of the URL after `#`, called the "hash" or "fragment".

For example, if your SPA is a static file called `index.html`, your URLs look like `index.html#/profile`, `index.html#/book/42`, etc. (The `index.html` part can usually be omitted for the index file, so you end up with URLs like `http://example.com/#/profile`.)

Hash-based routing is simpler, works well even without a server, and is generally better suited for static SPAs — especially when SEO isn't a concern, as is the case when the app requires authentication. Many popular apps use hash-based routing, including GMail!

This is the default, so no extra configuration is needed:

```svelte
<Router {routes} />
```

## Path-based routing (History API)

If you prefer clean URLs without the `#` fragment (e.g. `http://example.com/profile` instead of `http://example.com/#/profile`), enable path-based routing using the History API by setting `hashMode={false}`:

```svelte
<Router {routes} hashMode={false} />
```

All other APIs (`push`, `pop`, `replace`, `use:link`, `use:active`, route definitions) work exactly the same in both modes. No changes to your route definitions or navigation code are needed.

:::info Server configuration required
Path-based routing requires your server to serve `index.html` for all routes (SPA fallback). See [Path-based routing → Server configuration](path-routing.md#server-configuration) for Nginx, Apache, Netlify, Vercel, and Cloudflare Pages examples.
:::

## Choosing a mode

| | Hash mode (default) | Path mode (`hashMode={false}`) |
|---|---|---|
| Example URL | `example.com/#/book/42` | `example.com/book/42` |
| Server config needed | No | Yes — SPA fallback to `index.html` |
| Works from `file://` / static host as-is | Yes | Needs rewrites |
| Clean, shareable, SEO-friendly URLs | No | Yes |
| Serve from a sub-path | n/a | Via [`basePath`](path-routing.md#base-path) |

If you're building a fully static app, an admin panel behind auth, or something served straight off a CDN with no rewrite rules, **hash mode** is the path of least resistance. If clean URLs matter and you control the server, use **path mode**.

## Switching programmatically

You can also set the mode programmatically with `setHashMode`, which is useful if you need to configure it before the Router component mounts:

```js
import { setHashMode } from '@bmlt-enabled/svelte-spa-router'

// Switch to path-based routing
setHashMode(false)

// Path-based routing served under a sub-path
setHashMode(false, '/meetings')
```

See [Path-based routing](path-routing.md) for the full deep dive, including base paths and server configuration.
