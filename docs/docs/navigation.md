---
id: navigation
title: Navigation
sidebar_position: 4
description: Navigate between pages with links, the use:link action, and programmatically.
---

# Navigation

## With anchor tags

In **hash mode** (the default), you navigate between pages with normal anchor (`<a>`) tags using the `#` prefix:

```svelte
<a href="#/book/123">Thus Spoke Zarathustra</a>
```

In **path mode** (`hashMode={false}`), use regular paths:

```svelte
<a href="/book/123">Thus Spoke Zarathustra</a>
```

## The `use:link` action

Rather than typing `#` before each link — and to keep the same markup working in both routing modes — you can use the `use:link` action. You always write paths starting with `/` and the router handles the rest:

```svelte
<script>
    import { link } from '@bmlt-enabled/svelte-spa-router'
</script>

<a href="/book/321" use:link>The Little Prince</a>
```

The `use:link` action accepts an optional parameter `opts`, which can be one of:

- A dictionary `{href: '/foo', disabled: false}` where both keys are optional:
    - If you set a value for `href`, your link will be updated to point to that address, reactively (this always takes precedence over the `href` attribute, if present).
    - Setting `disabled: true` disables the link, so clicking it has no effect.
- A string with a destination (e.g. `/foo`), which is shorthand for `{href: '/foo'}`.

For example:

```svelte
<script>
    import { link } from '@bmlt-enabled/svelte-spa-router'
    let myLink = '/book/456'
</script>

<!-- Note the {{...}} notation because we're passing an object as parameter for a Svelte action -->
<a use:link={{ href: myLink, disabled: false }}>The Biggest Princess</a>
```

The above is equivalent to:

```svelte
<a use:link={myLink}>The Biggest Princess</a>
```

Changing the value of `myLink` reactively updates the link's `href` attribute.

## Navigating programmatically

You can navigate between pages programmatically too:

```js
import { push, pop, replace } from '@bmlt-enabled/svelte-spa-router'

// push(url) navigates to another page, just like clicking on a link
push('/book/42')

// pop() is equivalent to hitting the back button in the browser
pop()

// replace(url) navigates to a new page, but without adding a new entry in the
// browser's history stack — so the back button won't return to the previous page
replace('/book/3')
```

These methods can be used inside Svelte markup too, for example:

```svelte
<button onclick={() => push('/page')}>Go somewhere</button>
```

:::info Navigation happens on the next tick
`push`, `pop`, and `replace` perform their navigation only in the next iteration ("tick") of the JavaScript event loop. This makes it safe to use them inside `onMount` callbacks.

They return a Promise that resolves once the navigation has been triggered (on the next tick) — but note that this is likely **before** the new page has rendered.
:::
