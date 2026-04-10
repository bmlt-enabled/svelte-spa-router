# Advanced usage

@bmlt-enabled/svelte-spa-router is simple by design. A minimal router is easy to learn and implement, adds minimum overhead, and leaves more control in the hands of the developers.

Thanks to the many features of Svelte or other components in the ecosystem, @bmlt-enabled/svelte-spa-router can be used to get many more "advanced" features. This document explains how to achieve certain results with @bmlt-enabled/svelte-spa-router beyond what's offered by the component itself.

- [Route wrapping](#route-wrapping), including:
    - [Dynamically-imported routes and placeholders](#async-routes-and-loading-placeholders)
    - [Route pre-conditions](#route-pre-conditions) ("route guards")
    - [Adding user data to routes](#user-data)
    - [Static props](#static-props)
- [`onRouteEvent`](#onrouteevent)
- [`onRouteLoading` and `onRouteLoaded`](#onrouteloading-and-onrouteloaded-callback-props)
- [Querystring parsing](#querystring-parsing)
- [Route transitions](#route-transitions)
- [Nested routers](#nested-routers)
- [Route groups](#route-groups)
- [Restore scroll position](#restore-scroll-position)
- [Path-based routing (History API)](#path-based-routing-history-api)

## Route wrapping

As shown in the intro documentation, the `wrap` method allows defining components that need to be dynamically-imported at runtime, which makes it possible to support code-splitting.

The `wrap` method allows a few more interesting features, however:

- In addition to dynamically-importing components, you can define a component to be shown while a dynamically-imported one is being requested
- You can add pre-conditions to routes (sometimes called "route guards")
- You can add custom user data that is then used with the [`onRouteLoading` and `onRouteLoaded` callback props](#onrouteloading-and-onrouteloaded)
- You can set static props, which are passed to the component as mounted by the router

### The `wrap` method

The `wrap(options)` method is imported from `@bmlt-enabled/svelte-spa-router/wrap`:

```js
import { wrap } from '@bmlt-enabled/svelte-spa-router/wrap'
```

It accepts a single `options` argument that is an object with the following properties:

- `options.component`: Svelte component to use, statically-included in the bundle. This is a Svelte component, such as `component: Foo`, with that previously imported with `import Foo from './Foo.svelte'`.
- `options.asyncComponent`: Used to dynamically-import components. This must be a function definition that returns a dynamically-imported component, such as: `asyncComponent: () => import('./Foo.svelte')`
- `options.loadingComponent`: Used together with `asyncComponent`, this is a Svelte component, that must be part of the bundle, which is displayed while `asyncComponent` is being downloaded. If this is empty, then the router will not display any component while the request is in progress.
- `options.loadingParams`: When using a `loadingComponent`, this is an optional dictionary that will be passed to the component as the `params` prop.
- `options.userData`: Optional dictionary that will be passed to callbacks such as `onRouteLoading`, `onRouteLoaded`, `onConditionsFailed`.
- `options.conditions`: Optional array of route pre-condition functions to add, which will be executed in order.
- `options.props`: Optional dictionary of props that are passed to the component when mounted. The props are expanded with the spread operator (`{...props}`), so the key of each element becomes the name of the prop.

One and only one of `options.component` or `options.asyncComponent` must be set; all other properties are optional.

You use the `wrap` method in your route definition, such as:

```js
import Books from './Books.svelte'

// Using a dictionary to define the route object
const routes = {
    '/books': wrap({
        component: Books,
        userData: { foo: 'bar' },
    }),
}

// Using a map
const routes = new Map()
routes.set(
    '/books',
    wrap({
        component: Books,
        userData: { foo: 'bar' },
    }),
)
```

### Async routes and loading placeholders

The `wrap` method supports dynamically-imported components, enabling code-splitting so that code for less-common routes is downloaded on-demand rather than shipped in the app's core bundle.

This is done by setting the `options.asyncComponent` property to a function that returns a dynamically-imported module. For example:

```js
const routes = {
    '/book/:id': wrap({
        asyncComponent: () => import('./Book.svelte'),
    }),
}
```

Note that the value of `asyncComponent` must be a function definition, such as `() => import(…)`, and **not** `import(…)` (which is a function invocation). The latter would in fact request the module right away (albeit asynchronously), rather than on-demand when needed.

By default, while a module is being downloaded, the router does not display any component. You can however define a component (which must be statically-included in the app's bundle) to be displayed while the router is downloading a module. This is done with the `options.loadingComponent` property. Additionally, with `options.loadingParams` you can define a JavaScript object/dictionary that is passed to the loading placeholder component as the `params` prop.

For example, with a `Loading.svelte` component:

```svelte
<script>
    let { params = null } = $props()
</script>

<h2>Loading</h2>
{#if params && params.message}
    <p id="loadingmessage">Message is {params.message}</p>
{/if}
```

You can define the route as:

```js
// Import the wrap method
import { wrap } from '@bmlt-enabled/svelte-spa-router/wrap'

// Statically-included components
import Loading from './Loading.svelte'

// Route definition object
const routes = {
    // Wrapping the Book component
    '/book/*': wrap({
        // Dynamically import the Book component
        asyncComponent: () => import('./Book.svelte'),
        // Display the Loading component while the request for the Book component is pending
        loadingComponent: Loading,
        // Value for `params` in the Loading component
        loadingParams: {
            message: 'secret',
            foo: 'bar',
        },
    }),
}
```

### User data

The `wrap` method can also be used to add a dictionary with custom user data, that will be passed to all pre-condition functions (more on that below), and to the [`onRouteLoading`, `onRouteLoaded`](#onrouteloading-and-onrouteloaded), and [`onConditionsFailed`](#route-pre-conditions) callback props.

This is useful to pass custom callbacks (as properties inside the dictionary) that can be used by the `onRouteLoading`, `onRouteLoaded`, and `onConditionsFailed` callback handlers to take specific actions.

For example:

```js
import Books from './Books.svelte'

const routes = {
    // Using a statically-included component and adding user data
    '/books': wrap({
        component: Books,
        userData: { foo: 'bar' },
    }),
    // Same, but for dynamically-loaded components
    '/authors': wrap({
        asyncComponent: () => import('./Authors.svelte'),
        userData: { hello: 'world' },
    }),
}
```

### Route pre-conditions

You can define pre-conditions on routes, also known as "route guards". You can define one or more functions that the router will execute before loading the component that matches the current path. Your application can use pre-conditions to implement custom checks before routes are loaded, for example ensuring that users are authenticated.

Pre-conditions are defined in the `options.conditions` argument for the `wrap` function, which is an array of callbacks.

Each pre-condition function receives a dictionary `detail` with the same structure as `onRouteLoading` (more information [below](#onrouteloading-and-onrouteloaded)):

- `detail.route`: the route that was matched, exactly as defined in the route definition object
- `detail.location`: the current path (same as `router.location`)
- `detail.querystring`: the current "querystring" parameters from the page's hash (same as `router.querystring`)
- `detail.userData`: custom user data passed with the `wrap` function (see above)

The pre-condition functions must return a boolean indicating wether the condition succeeded (true) or failed (false).

You can define any number of pre-conditions for each route, and they're executed in order. If all pre-conditions succeed (returning true), the route is loaded. If one condition fails, the router stops executing pre-conditions and does not load any route.

Example:

```svelte
<script>
    import Router from '@bmlt-enabled/svelte-spa-router'
    import { wrap } from '@bmlt-enabled/svelte-spa-router/wrap'

    import Lucky from './Lucky.svelte'
    import Hello from './Hello.svelte'

    // Route definition object
    const routes = {
        // This route has a pre-condition function that lets people in only 50% of times, and a second pre-condition that is always true
        '/lucky': wrap({
            // The Svelte component used by the route
            component: Lucky,

            // Custom data: any JavaScript object
            // This is optional and can be omitted
            // It can be useful to understand the component who caused the pre-condition failure
            userData: {
                hello: 'world',
                myFunc: () => {
                    console.log('do something!')
                },
            },

            // List of route pre-conditions
            conditions: [
                // First pre-condition function
                (detail) => {
                    // Pre-condition succeeds only 50% of times
                    return Math.random() > 0.5
                },
                // Second pre-condition function
                (detail) => {
                    // This pre-condition is executed only if the first one succeeded
                    console.log(
                        'Pre-condition 2 executed',
                        detail.location,
                        detail.querystring,
                    )
                    // Always succeed
                    return true
                },
            ],
        }),
    }
</script>

<!-- App.svelte -->
<Router {routes} />
```

Pre-conditions can be applied to dynamically-loaded routes too.

Pre-conditions can also be asynchronous functions. This is helpful, for example, to request authentication data or user profiles. For example:

```js
const routes = {
    // This route has an async function as pre-condition
    '/admin': wrap({
        // Use a dynamically-loaded component for this
        asyncComponent: () => import('./Admin.svelte'),
        // Adding one pre-condition that's an async function
        conditions: [
            async (detail) => {
                // Make a network request, which are async operations
                const response = await fetch('/user/profile')
                const data = await response.json()
                // Return true to continue loading the component, or false otherwise
                if (data.isAdmin) {
                    return true
                } else {
                    return false
                }
            },
        ],
    }),
}
```

In case a condition fails, the router calls the `onConditionsFailed` callback prop with the same `detail` dictionary.

You can handle `onConditionsFailed` and perform actions in case no route wasn't loaded because of a failed pre-condition:

```svelte
<script>
    // Handles when a component can't be loaded because one of its pre-condition failed
    function onConditionsFailed(detail) {
        console.error('onConditionsFailed', detail)

        // Perform any action, for example replacing the current route
        if (detail.userData.foo == 'bar') {
            replace('/hello/world')
        }
    }

    // Handles when a component was loaded
    function onRouteLoaded(detail) {
        console.log('onRouteLoaded', detail)
    }
</script>

<Router {routes} {onConditionsFailed} {onRouteLoaded} />
```

### Static props

In certain cases, you might need to pass static props to a component within the router.

For example, assume this component `Foo.svelte`:

```svelte
<script>
    let { num } = $props()
</script>

<p>The secret number is {num}</p>
```

If `Foo` is a route in your application, you can pass a series of props to it through the router, using `wrap`:

```svelte
<script>
    // Import the router and routes
    import Router from '@bmlt-enabled/svelte-spa-router'
    import { wrap } from '@bmlt-enabled/svelte-spa-router/wrap'
    import Foo from './Foo.svelte'

    // Route definition object
    const routes = {
        '/': wrap({
            component: Foo,
            // Static props
            props: {
                num: 42,
            },
        }),
    }
</script>

<Router {routes} />
```

## `onRouteEvent`

The `onRouteEvent` callback prop can be used to bubble events from a component displayed by the router, to the router's parent component.

For example, assume that your Svelte component `App` contains the router's component `Router`. Inside the router, the current view is displaying the `Foo` component. If `Foo` emitted an event, `Router` would receive it and would ignore it by default

Using **`onRouteEvent`**, instead, allows your components within the router (such as `Foo`) to bubble a payload to the `Router` component's parent.

Example for `App.svelte`:

```svelte
<script>
    import Router from '@bmlt-enabled/svelte-spa-router'
    import Foo from './Foo.svelte'
    const routes = { '*': Foo }
    function onRouteEvent(detail) {
        // Do something
    }
</script>

<Router {routes} {onRouteEvent} />
```

Example for `Foo.svelte`:

```svelte
<script>
    let { onRouteEvent = () => {} } = $props()
</script>

<button onclick={() => onRouteEvent({ foo: 'bar' })}>Hello</button>
```

## `onRouteLoading` and `onRouteLoaded`

These two callbacks are used by the router to notify the application when routes are being mounted. You can optionally listen to these callbacks and trigger any custom logic.

First, the router calls `onRouteLoading` when it's about to mount a new component. If the component is [dynamically-imported](/README.md#dynamically-imported-routes-and-code-splitting) and needs to be requested, this callback is fired when the component is being requested. In all other cases, such as if the dynamically-imported component has already been loaded, or if the component is statically included in the bundle, `onRouteLoading` is still called right before `onRouteLoaded`.

Eventually, the router calls `onRouteLoaded` after a route has been successfully loaded (and injected in the DOM).

The callback for **`onRouteLoading`** receives the following `detail` object directly:

```js
// For onRouteLoading
detail = {
    // The route that was matched, as in the route definition object
    route: '/book/:id',
    // The current path (same as router.location)
    // Note that this is different from the route property: route is the definition, location is the actual path the user requested
    location: '/book/343',
    // The "querystring" from the page's hash (same as router.querystring)
    querystring: 'foo=bar',
    // Params matched from the route (such as :id from the route)
    params: { id: '343' },
    // User data passed with the wrap function; can be any kind of object/dictionary
    userData: {...}
}
```

For **`onRouteLoaded`**, the `detail` argument contains the four properties above in addition to:

```js
// For onRouteLoaded
detail = {
    // This includes the four properties of the detail object sent to onRouteLoading:
    route: '/book/:id',
    location: '/book/343',
    querystring: 'foo=bar',
    userData: {...}

    // Additionally, it includes two more properties:

    // The name of the Svelte component that was loaded
    name: 'Book',
    // The actual Svelte component that was loaded (a function)
    component: function() {...},
}
```

For example:

```svelte
<script>
    function onRouteLoading(detail) {
        console.log('onRouteLoading')
        console.log('Route', detail.route)
        console.log('Location', detail.location)
        console.log('Querystring', detail.querystring)
        console.log('User data', detail.userData)
    }

    function onRouteLoaded(detail) {
        console.log('onRouteLoaded')
        // The first 5 properties are the same as for onRouteLoading
        console.log('Route', detail.route)
        console.log('Location', detail.location)
        console.log('Querystring', detail.querystring)
        console.log('Params', detail.params)
        console.log('User data', detail.userData)
        // The last two properties are unique to onRouteLoaded
        console.log('Component', detail.component) // This is a Svelte component, so a function
        console.log('Name', detail.name)
    }
</script>

<Router {routes} {onRouteLoading} {onRouteLoaded} />
```

For help with the `wrap` function, check the [route wrapping](#route-wrapping) section.

> **Note:** When using minifiers such as terser, the name of Svelte components might be altered by the minifier. As such, it is recommended to use custom user data to identify the component who caused the pre-condition failure, rather than relying on the `detail.name` property. The latter, might contain the minified name of the class.

## Querystring parsing

You can extract parameters from the "querystring" in the hash of the page. This allows you to build apps that navigate to pages such as `#/search?query=hello+world&sort=title`.

The router returns the full querystring string without parsing it. Access it via `router.querystring`:

```svelte
<script>
    import { router } from '@bmlt-enabled/svelte-spa-router'
</script>

<p>The current page is: {router.location}</p>
<p>The querystring is: {router.querystring}</p>
```

When visiting the page `#/search?query=hello+world&sort=title`, this would generate:

```text
The current page is: /search
The querystring is: query=hello+world&sort=title
```

To parse the querystring into a dictionary, use [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) (available in all modern browsers) or a library like [qs](https://www.npmjs.com/package/qs).

Here's an example using `qs`:

```svelte
<script>
    import { parse } from 'qs'
    import { router } from '@bmlt-enabled/svelte-spa-router'

    const parsed = $derived(parse(router.querystring))
</script>

<code>{JSON.stringify(parsed)}</code>
```

With the same URL as before, the result would be:

```text
{"query":"hello world","sort":"title"}
```

`qs` supports advanced things such as arrays, nested objects, etc. Check out their [README](https://github.com/ljharb/qs) for more information.

## Route transitions

It's easy to add a nice transition between routes, leveraging the built-in [transitions](https://svelte.dev/docs#Transitions) of Svelte.

For example, to make your components fade in gracefully, you can wrap the markup in a container (e.g. `<div>`, or `<section>`, etc) and attach a Svelte transition to that. For example:

```svelte
<script>
    import { fade } from 'svelte/transition'
</script>

<div in:fade={{ duration: 500 }}>
    <h2>Component's code goes here</h2>
</div>
```

When you apply the transition to multiple components, you can get a smooth transition effect:

For more details: [official documentation](https://svelte.dev/docs#Transitions) on Svelte transitions.

## Nested routers

The `<Router>` component of @bmlt-enabled/svelte-spa-router can be nested without issues.

For example, consider an app with these four components:

```svelte
<!-- App.svelte -->
<script>
import Router from '@bmlt-enabled/svelte-spa-router'
import Hello from './Hello.svelte'
// Routes for the "outer router"
const routes = {
    // Define both '/hello' and '/hello/*' to match the path with and without sub-paths
    '/hello': Hello,
    '/hello/*': Hello,
}
// Note: with a Map you could use a regex instead:
// routes.set(/^\/hello(\/(.*))?/, Hello)
</script>

<Router {routes} />

<!-- Hello.svelte -->
<script>
import Router from '@bmlt-enabled/svelte-spa-router'
import FullName from './FullName.svelte'
import ShortName from './ShortName.svelte'
// Routes for the "inner router"
// Note that we have a "prefix" property for this nested router
const prefix = '/hello'
const routes = {
    '/:first/:last': FullName,
    '/:first': ShortName,
}
</script>

<h2>Hello!</h2>
<Router {routes} {prefix} />

<!-- FullName.svelte -->
<script>
let { params = {} } = $props()
</script>

<p>You gave us both a first name and last name!</p>
<p>First: {params.first}</p>
<p>Last: {params.last}</p>

<!-- ShortName.svelte -->
<script>
let { params = {} } = $props()
</script>

<p>You shy person, giving us a first name only!</p>
<p>First: {params.first}</p>
```

This works as you would expect:

- `#/hello/John` will show the `ShortName` component and pass "John" as `params.first`
- `#/hello/Jane/Doe` will show the `FullName` component, pass "Jane" as `params.first`, and "Doe" as `params.last`
- Both routes will also display the `Hello!` header.

Both routes first load the `Hello` route, as they both match `/hello/*` in the outer router. The inner router then loads the separate components based on the path.

Features like highlighting active links will still work, regardless of where those links are placed in the page (in which component).

Note that if your parent router uses a route that contains parameters, such as `/user/:id`, then you must define a regular expression for `prefix`. For example: `prefix={/^\/user\/[0-9]+/}`.

## Route groups

You can get route groups by creating a Svelte component which nests the other components. For example:

```svelte
<script>
    import RouteA from './RouteA.svelte'
    import RouteB from './RouteB.svelte'
</script>

<!-- RouteA.svelte -->
<h2>This is route A</h2>

<!-- RouteB.svelte -->
<h2>This is route B</h2>

<!-- GroupRoute.svelte -->
<RouteA />
<RouteB />
```

When you add `GroupRoute` as a component in your router, you will render both `RouteA` and `RouteB`.

## Restore scroll position

The `Router` component has an option to restore the scroll position when the user navigates to the previous page.

To enable that, set the `restoreScrollState` property to `true` in the router (it's disabled by default):

```svelte
<Router {routes} restoreScrollState={true} />
```

**Important:** In order for the scroll position to be restored, you need to trigger a page navigation using either the `use:link` action or the `push` method. Navigating using links starting with `#` (such as `<a href="#/books">`) will not allow restoring the scroll position.

## Path-based routing (History API)

By default, @bmlt-enabled/svelte-spa-router uses hash-based routing (e.g. `http://example.com/#/books`). If you prefer clean URLs without the hash fragment, you can switch to path-based routing using the HTML5 History API.

### Enabling path mode

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

### Programmatic configuration

You can also set the routing mode programmatically using `setHashMode`, which is useful if you need to configure the mode before the Router component mounts:

```js
import { setHashMode } from '@bmlt-enabled/svelte-spa-router'

// Switch to path-based routing
setHashMode(false)
```

### What stays the same

All other APIs work identically in both modes:

- **Route definitions** use the same syntax (`/`, `/books`, `/user/:id`, `*`)
- **`push()`, `pop()`, `replace()`** accept the same path format (e.g. `push('/books')`)
- **`use:link`** works the same way: `<a href="/books" use:link>`
- **`use:active`** works the same way
- **`router.location`**, **`router.querystring`**, **`router.params`** all work the same
- **Route pre-conditions**, **`wrap()`**, **callbacks** all work the same

### Server configuration

When using path-based routing, your server must be configured to serve your `index.html` for all routes. Without this, refreshing the page or navigating directly to a URL like `/books` will result in a 404 from the server, since no file exists at that path.

Common server configurations:

**Nginx:**

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

**Apache (.htaccess):**

```apache
FallbackResource /index.html
```

**Netlify (_redirects):**

```
/*    /index.html   200
```

**Vercel (vercel.json):**

```json
{
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Vite dev server:** Handles SPA fallback by default, no extra configuration needed.
