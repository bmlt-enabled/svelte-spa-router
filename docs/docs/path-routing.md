---
id: path-routing
title: Path-based routing & base path
sidebar_position: 10
description: Clean URLs with the History API, serving from a sub-path, and configuring your server for SPA fallback.
---

# Path-based routing (History API)

By default, @bmlt-enabled/svelte-spa-router uses hash-based routing (e.g. `http://example.com/#/books`). If you prefer clean URLs without the hash fragment, you can switch to path-based routing using the HTML5 History API. This is a feature added by this BMLT fork on top of the original upstream project.

## Enabling path mode

Set the `hashMode` prop to `false` on the Router component:

```svelte
<script>
    import Router from '@bmlt-enabled/svelte-spa-router'

    const routes = {
        '/': Home,
        '/books': Books,
        '*': NotFound,
    }
</script>

<Router {routes} hashMode={false} />
```

With this configuration, URLs will look like `http://example.com/books` instead of `http://example.com/#/books`.

## Programmatic configuration

You can also set the routing mode programmatically using `setHashMode`, which is useful if you need to configure the mode before the Router component mounts:

```js
import { setHashMode } from '@bmlt-enabled/svelte-spa-router'

// Switch to path-based routing
setHashMode(false)
```

## Base path

When your app is served under a sub-path (e.g. `example.com/meetings/`), you can set a `basePath` so the router automatically strips it from incoming URLs and prepends it to outgoing ones:

```svelte
<Router {routes} hashMode={false} basePath="/meetings" />
```

Or programmatically:

```js
import { setHashMode } from '@bmlt-enabled/svelte-spa-router'

setHashMode(false, '/meetings')
```

With `basePath="/meetings"`:

- `push('/book/42')` navigates to `/meetings/book/42`
- `router.location` returns `/book/42`

Your app code never needs to know about the prefix — you always work with paths relative to the base.

## What stays the same

All other APIs work identically in both modes:

- **Route definitions** use the same syntax (`/`, `/books`, `/user/:id`, `*`)
- **`push()`, `pop()`, `replace()`** accept the same path format (e.g. `push('/books')`)
- **`use:link`** works the same way: `<a href="/books" use:link>`
- **`use:active`** works the same way
- **`router.location`**, **`router.querystring`**, **`router.params`** all work the same
- **Route pre-conditions**, **`wrap()`**, and **callbacks** all work the same

## Server configuration

When using path-based routing, your server must be configured to serve your `index.html` for all routes (SPA fallback). Without this, refreshing the page or navigating directly to a URL like `/books` will result in a **404** from the server, since no file exists at that path.

Common server configurations:

### Nginx

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Apache (`.htaccess`)

```apacheconf
FallbackResource /index.html
```

### Netlify (`_redirects`)

```text
/*    /index.html   200
```

### Vercel (`vercel.json`)

```json
{
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Cloudflare Pages

Cloudflare Pages serves SPA fallbacks automatically for single-page apps, but you can make it explicit by adding a `_redirects` file to your build output:

```text
/*    /index.html   200
```

### Vite dev server

Handles SPA fallback by default — no extra configuration needed.
