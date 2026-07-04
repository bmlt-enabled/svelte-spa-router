---
id: active-links
title: Active links
sidebar_position: 7
description: Automatically mark links as active with the use:active action.
---

# Active links

@bmlt-enabled/svelte-spa-router has built-in support for automatically marking links as "active", with the `use:active` action.

For example, the code below adds the CSS class `active` to links that are active:

```svelte
<script>
    import { link } from '@bmlt-enabled/svelte-spa-router'
    import active from '@bmlt-enabled/svelte-spa-router/active'
</script>

<a
    href="/hello/user"
    use:link
    use:active={{
        path: '/hello/*',
        className: 'active',
        inactiveClassName: 'inactive',
    }}>Say hi!</a
>
<a href="/hello/user" use:link use:active={'/hello/*'}>Say hi with a default className!</a>
<a href="/hello/user" use:link use:active>Say hi with all default options!</a>

<style>
    /* Style for "active" links; need to mark this :global because the router
       adds the class directly */
    :global(a.active) {
        color: #ef562f;
    }
</style>
```

## Options

The `active` action accepts a dictionary `options` as its argument:

- **`options.path`** — the path that, when matched, makes the link active. In the first example above, we want the link to be active when the route is `/hello/*` (the asterisk matches anything after that). Note that this doesn't have to be the same as the path the link points to. When omitted or falsy, it defaults to the path in the link's `href` attribute. This can also be a **regular expression**: for example, `/^\/*\/hi$/` makes the link active when the path starts with `/` and ends with `/hi`, regardless of what's in between.
- **`options.className`** — the name of the CSS class to add. Optional; defaults to `active`.
- **`options.inactiveClassName`** — the name of the CSS class to add when the link is _not_ active. Optional; defaults to nothing.

As a shorthand, instead of passing a dictionary, you can pass a single string or regular expression that will be interpreted as `options.path`.

:::tip Works in both routing modes
`use:active` behaves identically in hash mode and path mode — you always write paths starting with `/`.
:::
