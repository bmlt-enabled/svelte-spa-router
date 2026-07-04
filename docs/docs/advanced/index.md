---
id: index
title: Advanced usage
sidebar_label: Overview
sidebar_position: 1
description: Route wrapping, guards, callbacks, transitions, nested routers, and more.
---

# Advanced usage

@bmlt-enabled/svelte-spa-router is simple by design. A minimal router is easy to learn and implement, adds minimum overhead, and leaves more control in the hands of developers.

Thanks to the many features of Svelte and its ecosystem, @bmlt-enabled/svelte-spa-router can be used to achieve many more "advanced" results. These pages explain how to go beyond what the component offers out of the box:

- **[Route wrapping](route-wrapping.md)**, including:
    - [Async routes and loading placeholders](route-wrapping.md#async-routes-and-loading-placeholders)
    - [Route pre-conditions](route-wrapping.md#route-pre-conditions) ("route guards")
    - [User data](route-wrapping.md#user-data)
    - [Static props](route-wrapping.md#static-props)
- **[Route events & callbacks](route-events.md)** — `onRouteEvent`, `onRouteLoading`, and `onRouteLoaded`
- **[Route transitions](route-transitions.md)**
- **[Nested routers](nested-routers.md)**
- **[Route groups](route-groups.md)**
- **[Restore scroll position](restore-scroll-position.md)**

For clean, path-based URLs and base-path support, see [Path-based routing](../path-routing.md).
