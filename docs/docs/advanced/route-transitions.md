---
id: route-transitions
title: Route transitions
sidebar_position: 4
description: Add smooth transitions between routes using Svelte's built-in transitions.
---

# Route transitions

It's easy to add a nice transition between routes, leveraging the built-in [transitions](https://svelte.dev/docs/svelte/transition) of Svelte.

For example, to make your components fade in gracefully, wrap the markup in a container (e.g. `<div>` or `<section>`) and attach a Svelte transition to it:

```svelte
<script>
    import { fade } from 'svelte/transition'
</script>

<div in:fade={{ duration: 500 }}>
    <h2>Component's code goes here</h2>
</div>
```

When you apply the transition to multiple components, you get a smooth transition effect as the router swaps them.

For more details, see the [official Svelte documentation](https://svelte.dev/docs/svelte/transition) on transitions.
