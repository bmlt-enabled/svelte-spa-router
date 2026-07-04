---
id: restore-scroll-position
title: Restore scroll position
sidebar_position: 7
description: Restore the scroll position when users navigate back to a previous page.
---

# Restore scroll position

The `Router` component has an option to restore the scroll position when the user navigates to the previous page.

To enable it, set the `restoreScrollState` property to `true` (it's disabled by default):

```svelte
<Router {routes} restoreScrollState={true} />
```

:::warning
For the scroll position to be restored, you need to trigger navigation using either the [`use:link`](../navigation.md#the-uselink-action) action or the [`push`](../navigation.md#navigating-programmatically) method. Navigating using links starting with `#` (such as `<a href="#/books">`) will **not** allow restoring the scroll position.
:::

## Manually restoring scroll position

For advanced cases where you want to restore the scroll position yourself (for example, only on certain routes), the router exports a `restoreScroll` function. It takes an optional history-state object containing the previously-saved scroll coordinates; if no state is passed, it scrolls to the top of the page.

```svelte
<script>
    import { restoreScroll } from '@bmlt-enabled/svelte-spa-router'

    function onRouteLoaded() {
        // Scroll back to a saved position, or to the top if none was saved
        restoreScroll(history.state)
    }
</script>
```

The shape of the saved state is `{ __svelte_spa_router_scrollX: number, __svelte_spa_router_scrollY: number }`. When `restoreScrollState={true}` is set on the Router, this is called automatically — you only need to use `restoreScroll` directly if you've disabled the automatic behavior and want fine-grained control.
