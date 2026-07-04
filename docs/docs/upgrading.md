---
id: upgrading
title: Upgrading
sidebar_position: 11
description: Breaking changes between major versions and how to migrate your application.
---

# Upgrading

This page documents the breaking changes between major versions and how to migrate your application.

:::info Fork history
This package is a fork of [ItalyPaleAle/svelte-spa-router](https://github.com/ItalyPaleAle/svelte-spa-router). The `@bmlt-enabled` releases start at 5.x (Svelte 5) and add [path-based routing](path-routing.md) and [base-path support](path-routing.md#base-path). For the full, fork-specific release history see the [CHANGELOG](https://github.com/bmlt-enabled/svelte-spa-router/blob/main/CHANGELOG.md).
:::

## Upgrading to 5.x

The 5.x line requires **Svelte 5 or later**. When upgrading from 4.x to 5.x, note the following breaking changes.

### Use `router.loc`, `router.location`, and `router.querystring` instead of the store exports

The legacy store exports (`loc`, `location`, `querystring`, and `params`) are removed in favor of properties on the `router` object.

Update your imports and usages as follows:

```diff
<script>
-import {loc, location, querystring, params} from '@bmlt-enabled/svelte-spa-router'
+import {router} from '@bmlt-enabled/svelte-spa-router'

// usage examples
-params.subscribe(p => console.log(p))
+$effect(() => console.log(router.params))

-$: hasQueryString = !!$querystring
+const hasQueryString = $derived(!!router.querystring)
</script>

-Currently at {$location}
+Currently at {router.location}
```

### Use callback props instead of component events

Pass callback props to the router component rather than listening to custom component events. For example, `on:routeLoading` becomes `onRouteLoading`:

```diff
 <script>
-    function handleRouteLoading(event) {
-        console.log(event.detail)
+    function handleRouteLoading(detail) {
+        console.log(detail)
     }
 </script>

-<Router {routes} on:routeLoading={handleRouteLoading} />
+<Router {routes} onRouteLoading={handleRouteLoading} />
```

Likewise, migrate the other route callbacks too:

```diff
-<Router
-    {routes}
-    on:routeLoaded={handleRouteLoaded}
-    on:conditionsFailed={handleConditionsFailed}
-/>
+<Router
+    {routes}
+    onRouteLoaded={handleRouteLoaded}
+    onConditionsFailed={handleConditionsFailed}
+/>
```

## Upgrading to 4.x

When upgrading from 3.x to 4.x, note the following breaking change. (4.x is designed to work with Svelte 3 and 4; for Svelte 5, use 5.x.)

### `wrap` must be imported from `svelte-spa-router/wrap`

The deprecated `wrap` method exported from the package root has been removed and replaced with an import from the `/wrap` sub-path. See [New `wrap` method](#new-wrap-method) below for details.

## Upgrading to 3.x

### URL parameters are now automatically decoded

Params extracted from the URL are now automatically decoded. For example, with a route `/book/:name` and a user navigating to `/book/dante%27s%20inferno`:

- ❌ **Old** behavior (2.x and older): `params.name` was `dante%27s%20inferno`
- ✅ **New** behavior (3.x+): `params.name` is `dante's inferno`

This is done by invoking [`decodeURIComponent`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent). If your application was decoding URL parameters itself, remove that when upgrading.

### New `wrap` method

The old `wrap` method exported from the package root was deprecated in favor of the `wrap` method exported from `/wrap`. The new method's signature accepts a single `options` object and adds support for many features including [dynamically-imported routes](advanced/route-wrapping.md#async-routes-and-loading-placeholders).

To upgrade while maintaining the same functionality:

```js
// ❌ Old
import {wrap} from '@bmlt-enabled/svelte-spa-router'

const routes = {
    // wrap(component, userData, ...conditions)
    '/foo': wrap(
        Foo,
        {foo: 'bar'},
        (detail) => { /* ... */ },
    ),
}
```

```js
// ✅ New
import {wrap} from '@bmlt-enabled/svelte-spa-router/wrap'

const routes = {
    // wrap(options)
    '/foo': wrap({
        component: Foo,
        userData: {foo: 'bar'},
        conditions: [
            (detail) => { /* ... */ },
        ],
    }),
}
```

See [Route wrapping](advanced/route-wrapping.md) for all the properties `wrap` supports.

## Upgrading to 2.x

### `use:active` syntax changes

The `use:active` action now takes a single argument: a dictionary with `path` and `className` (and `inactiveClassName`). As a shorthand, you can pass just a string, interpreted as `path`.

```svelte
<!-- ❌ Version 1.x -->
<a href="/hello/user" use:link use:active={'/hello/*', 'active'}>Say hi!</a>

<!-- ✅ Version 2.x+ -->
<a href="/hello/user" use:link use:active={{path: '/hello/*', className: 'active'}}>Say hi!</a>
```

See [Active links](active-links.md) for the current options.
