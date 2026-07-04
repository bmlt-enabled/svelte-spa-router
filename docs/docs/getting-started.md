---
id: getting-started
title: Getting started
sidebar_position: 2
description: Install @bmlt-enabled/svelte-spa-router and define your first routes.
---

# Getting started

You can use @bmlt-enabled/svelte-spa-router in any project built with **Svelte 5**.

## Install from npm

```bash
# npm
npm install @bmlt-enabled/svelte-spa-router

# yarn
yarn add @bmlt-enabled/svelte-spa-router

# pnpm
pnpm add @bmlt-enabled/svelte-spa-router
```

### Supported browsers

@bmlt-enabled/svelte-spa-router aims to support modern browsers, including recent versions of:

- Chrome
- Edge ("traditional" and Chromium-based)
- Firefox
- Safari

## Define your routes

Each route is a normal Svelte component, with markup, scripts, bindings, etc. Any Svelte component can be a route.

The route definition is a JavaScript dictionary (object) where the key is a string with the path (including parameters, etc.) and the value is the route component.

```js
import Home from './routes/Home.svelte'
import Author from './routes/Author.svelte'
import Book from './routes/Book.svelte'
import NotFound from './routes/NotFound.svelte'

const routes = {
    // Exact path
    '/': Home,

    // Named parameters, with the last one being optional
    '/author/:first/:last?': Author,

    // Wildcard parameter
    '/book/*': Book,

    // Catch-all
    // This is optional, but if present it must be the last route
    '*': NotFound,
}
```

Routes must begin with `/` (or `*` for the catch-all route).

Alternatively, you can define routes using [custom regular expressions](regular-expression-routes.md).

:::warning Order matters
When your users navigate inside the app, the **first matching path** determines which route to load. Always leave any "catch-all" route (e.g. a "Page not found" one) at the end.
:::

## Include the router view

In a Svelte component (usually `App.svelte`), import the router component:

```js
import Router from '@bmlt-enabled/svelte-spa-router'
```

Then place it anywhere in your markup:

```svelte
<body>
    <!-- Hash-based routing (default) -->
    <Router {routes} />

    <!-- …or clean URLs using the History API -->
    <Router {routes} hashMode={false} />
</body>
```

The `routes` prop is the dictionary defined above. The optional `hashMode` prop controls whether the router uses hash-based URLs (default, `true`) or the History API for clean path-based URLs (`false`). See [Routing modes](routing-modes.md) for details.

That's it! You already have all that you need for a fully-functional routing experience.

## Run the sample code

Check out the [`examples`](https://github.com/bmlt-enabled/svelte-spa-router/tree/main/examples) folder for usage examples. To run them, clone the repository, install dependencies, then start a dev server:

```bash
git clone https://github.com/bmlt-enabled/svelte-spa-router
cd svelte-spa-router
npm install

# Hash-mode example        → http://localhost:5050
npm run dev:example

# Path-mode example        → http://localhost:5054
npm run dev:example-path
```

## Next steps

- [Navigate between pages](navigation.md) with links and programmatically
- Read [route parameters](route-parameters.md) and the [querystring](querystring.md)
- Highlight [active links](active-links.md)
- Enable [code splitting](code-splitting.md) with dynamically-imported components
