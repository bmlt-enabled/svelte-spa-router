---
id: querystring
title: Querystring
sidebar_position: 6
description: Read and parse querystring parameters from the URL in both routing modes.
---

# Querystring

You can extract querystring parameters from the URL. In **hash mode**, these are part of the hash fragment (e.g. `#/books?show=authors,titles&order=1`). In **path mode**, they come from the real URL querystring (e.g. `/books?show=authors,titles&order=1`).

The router separates the querystring from the location and returns it as a **string** in `router.querystring`:

```svelte
<script>
    import { router } from '@bmlt-enabled/svelte-spa-router'
</script>

<p>The current page is: {router.location}</p>
<p>The querystring is: {router.querystring}</p>
```

With the example above, this would print:

```text
The current page is: /books
The querystring is: show=authors,titles&order=1
```

## Parsing the querystring

To keep this component lightweight, @bmlt-enabled/svelte-spa-router **does not parse** the querystring. To turn it into a dictionary, use [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) (available in all modern browsers) or a library such as [qs](https://www.npmjs.com/package/qs).

### Using `URLSearchParams`

```svelte
<script>
    import { router } from '@bmlt-enabled/svelte-spa-router'

    const parsed = $derived(new URLSearchParams(router.querystring))
</script>

<p>show = {parsed.get('show')}</p>
```

### Using `qs`

`qs` supports advanced features such as arrays and nested objects:

```svelte
<script>
    import { parse } from 'qs'
    import { router } from '@bmlt-enabled/svelte-spa-router'

    const parsed = $derived(parse(router.querystring))
</script>

<code>{JSON.stringify(parsed)}</code>
```

For the URL `#/search?query=hello+world&sort=title`, the result would be:

```text
{"query":"hello world","sort":"title"}
```

Check out the [qs README](https://github.com/ljharb/qs) for more information.
