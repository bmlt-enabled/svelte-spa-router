---
id: route-groups
title: Route groups
sidebar_position: 6
description: Render multiple components together by nesting them in a group component.
---

# Route groups

You can create route groups by making a Svelte component that nests the other components. For example:

```svelte
<!-- RouteA.svelte -->
<h2>This is route A</h2>
```

```svelte
<!-- RouteB.svelte -->
<h2>This is route B</h2>
```

```svelte
<!-- GroupRoute.svelte -->
<script>
    import RouteA from './RouteA.svelte'
    import RouteB from './RouteB.svelte'
</script>

<RouteA />
<RouteB />
```

When you add `GroupRoute` as a component in your router, it renders both `RouteA` and `RouteB`.
