///<reference types="svelte" />

import type { Component } from 'svelte'

/** Dictionary with route details passed to pre-conditions and callback props */
export interface RouteDetail {
    /** Route matched as defined in the route definition (could be a string or a regular expression object) */
    route: string | RegExp

    /** Location path */
    location: string

    /** Querystring from the hash */
    querystring: string

    /** Params matched in the route */
    params: Record<string, string> | null

    /** Custom data passed by the user */
    userData?: object
}

/** Detail object for `onRouteLoaded` */
export interface RouteDetailLoaded extends RouteDetail {
    /** Svelte component */
    component: Component<any, any>

    /** Name of the Svelte component that was loaded (note: might be minified in production) */
    name: string
}

/**
 * This is a Svelte component loaded asynchronously.
 * It's meant to be used with the `import()` function, such as `() => import('Foo.svelte')}`
 */
export type AsyncSvelteComponent = () => Promise<{
    default: Component<any, any>
}>

/**
 * Route pre-condition function. This is a callback that receives a RouteDetail object as argument containing information on the route that we're trying to load.
 * The function must return a boolean indicating whether the route can be loaded. If the function returns `false`, the route is not loaded, and no other pre-condition function is executed.
 *
 * The pre-condition function can be asynchronous too, returning a boolean asynchronously.
 *
 * @param detail Route detail object
 * @returns If the callback returns a false-y value, it's interpreted as the precondition failed, so it aborts loading the component (and won't process other pre-condition callbacks)
 */
export type RoutePrecondition = (
    detail: RouteDetail,
) => boolean | Promise<boolean>

/** Object returned by the `wrap` method */
export interface WrappedComponent {
    /** Component to load (this is always asynchronous) */
    component: AsyncSvelteComponent

    /** Route pre-conditions to validate */
    conditions?: RoutePrecondition[]

    /** Optional dictionary of static props */
    props?: object

    /** Optional user data dictionary */
    userData?: object

    /**
     * Internal flag used by the router to identify wrapped routes
     * @internal
     */
    _sveltesparouter?: boolean
}

/**
 * Sets the routing mode.
 *
 * @param hashMode - If true (default), uses hash-based routing. If false, uses History API path-based routing.
 * @param basePath - Base path for path-based routing (e.g. '/meetings'). Stripped from incoming URLs and prepended to outgoing ones. Only used when hashMode is false.
 */
export function setHashMode(hashMode: boolean, basePath?: string): void

/**
 * Navigates to a new page programmatically.
 *
 * @param location Path to navigate to (must start with `/` or '#/')
 * @returns Promise that resolves after the page navigation has completed
 */
export function push(location: string): Promise<void>

/**
 * Navigates back in history (equivalent to pressing the browser's back button).
 *
 * @returns Promise that resolves after the page navigation has completed
 */
export function pop(): Promise<void>

/**
 * Replaces the current page but without modifying the history stack.
 *
 * @param location - Path to navigate to (must start with `/` or '#/')
 * @returns Promise that resolves after the page navigation has completed
 */
export function replace(location: string): Promise<void>

/** Type for the opts parameter of the link action */
export type LinkActionOpts = {
    /** A string to use in place of the link's href attribute. Using this allows for updating link's targets reactively. */
    href?: string
    /** If true, link is disabled */
    disabled?: boolean
}

/** Type for the update function of the link action */
export type LinkActionUpdateFunc =
    | ((opts?: LinkActionOpts) => void)
    | ((hrefVar?: string) => void)

/** Type for backwards-compatible (typo: Upate) */
export type LinkActionUpateFunc = LinkActionUpdateFunc
/**
 * Svelte Action that enables a link element (`<a>`) to use our history management.
 *
 * For example:
 *
 * ````html
 * <a href="/books" use:link>View books</a>
 * ````
 *
 * @param node - The target node (automatically set by Svelte). Must be an anchor tag (`<a>`) with a href attribute starting in `/`
 * @param opts - Dictionary with options for the link
 */
export function link(
    node: HTMLElement,
    opts?: LinkActionOpts,
): { update: LinkActionUpdateFunc; destroy: () => void }
export function link(
    node: HTMLElement,
    hrefVar?: string,
): { update: LinkActionUpdateFunc; destroy: () => void }

/**
 * Restores the scroll state from the given history state, or scrolls to the top
 * if no state is provided.
 *
 * @param state - The history state to restore from.
 */
export function restoreScroll(state?: {
    __svelte_spa_router_scrollX: number
    __svelte_spa_router_scrollY: number
}): void

/** Full location from the hash: page and querystring */
export interface Location {
    /** Location (page/view), for example `/book` */
    location: string

    /** Querystring as a string (not parsed); empty string when absent */
    querystring: string
}

/**
 * Router state object, containing the current location, querystring and params.
 */
export interface RouterState {
    /** The current full location (incl. querystring) */
    readonly loc: Location

    /** The current location (excluding querystring) */
    readonly location: string

    /** The current querystring (empty string when absent) */
    readonly querystring: string

    /** The currently-matched params */
    readonly params: Record<string, string> | undefined
}

/**
 * Router state object, containing the current location, querystring and params.
 */
export const router: RouterState

/** List of routes */
export type RouteDefinition =
    | Record<string, Component<any, any> | WrappedComponent>
    | Map<string | RegExp, Component<any, any> | WrappedComponent>

/** Props for the Router component */
export interface RouterProps {
    /**
     * Dictionary of all routes, in the format `'/path': component`.
     *
     * For example:
     * ````js
     * import HomeRoute from './routes/HomeRoute.svelte'
     * import BooksRoute from './routes/BooksRoute.svelte'
     * import NotFoundRoute from './routes/NotFoundRoute.svelte'
     * routes = {
     *     '/': HomeRoute,
     *     '/books': BooksRoute,
     *     '*': NotFoundRoute
     * }
     * ````
     */
    routes: RouteDefinition
    /**
     * Optional prefix for the routes in this router. This is useful for example in the case of nested routers.
     */
    prefix?: string | RegExp
    /**
     * If set to true (default), uses hash-based routing. If set to false, uses the History API
     * for clean URLs without the hash fragment (e.g. `/books` instead of `#/books`).
     *
     * Note: When using path-based routing (hashMode=false), your server must be configured to
     * serve the app for all routes (i.e., redirect all requests to index.html).
     */
    hashMode?: boolean
    /**
     * Base path for path-based routing (e.g. '/meetings'). Stripped from incoming URLs
     * and prepended to outgoing ones. Only used when hashMode is false.
     */
    basePath?: string
    /**
     * If set to true, the router will restore scroll positions on back navigation
     * and scroll to top on forward navigation.
     */
    restoreScrollState?: boolean
    /**
     * Callback fired when route conditions fail
     */
    onConditionsFailed?: (detail: RouteDetail) => void
    /**
     * Callback fired when a route starts loading
     */
    onRouteLoading?: (detail: RouteDetail) => void
    /**
     * Callback fired when a route has loaded
     */
    onRouteLoaded?: (detail: RouteDetailLoaded) => void
    /**
     * Callback for events from child components
     */
    onRouteEvent?: (detail: unknown) => void
}

/**
 * Router component
 */
declare const Router: Component<RouterProps>
export default Router
